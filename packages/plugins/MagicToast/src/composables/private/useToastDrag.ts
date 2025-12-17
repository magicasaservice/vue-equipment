import { computed, onScopeDispose, toRefs, toValue, type MaybeRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  guardedReleasePointerCapture,
  guardedSetPointerCapture,
  isIOS,
  interpolate,
  isWithinRange,
} from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useToastState } from './useToastState'
import { useToastView } from './useToastView'
import { useToastScrollLock } from './useToastScrollLock'

import type { ToastView } from '../../types'

interface UseToastDragArgs {
  instanceId: MaybeRef<string>
  view: ToastView
}

export function useToastDrag(args: UseToastDragArgs) {
  const { instanceId, view } = args

  const { initializeState } = useToastState(instanceId)
  const state = initializeState()

  const { options } = toRefs(state)
  const { threshold, animation, position, scrollLock } = options.value

  const { deleteView } = useToastView(instanceId)

  const {
    dragStart,
    dragging,
    shouldClose,
    interpolateTo,
    originX,
    originY,
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
  } = toRefs(view)

  let pointerdownTarget: HTMLElement | undefined = undefined
  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined
  let cancelTouchcancel: (() => void) | undefined = undefined

  const hasDragged = computed(() => {
    const hasDraggedX = !isWithinRange({
      input: draggedX.value,
      base: lastDraggedX.value,
      threshold: toValue(threshold).lock,
    })

    const hasDraggedY = !isWithinRange({
      input: draggedY.value,
      base: lastDraggedY.value,
      threshold: toValue(threshold).lock,
    })

    return hasDraggedX || hasDraggedY
  })

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  // Private functions
  const emitter = useMagicEmitter()

  const { lockScroll, unlockScroll } = useToastScrollLock()

  type InterpolateDraggedArgs = {
    to: number
    duration?: number
    easing?: (t: number) => number
  }

  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      to,
      duration = toValue(animation)?.snap?.duration || 300,
      easing,
    } = args

    switch (position) {
      case 'top':
      case 'top-left':
      case 'top-right':
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        interpolate({
          from: draggedY.value,
          to,
          duration,
          easing,
          callback: (value: number) => {
            draggedY.value = value
          },
        })

        break

      case 'left':
      case 'right':
        interpolate({
          from: draggedX.value,
          to,
          duration,
          easing,
          callback: (value: number) => {
            draggedX.value = value
          },
        })

        break
    }
  }

  function checkPosition() {
    const distanceX = Math.abs(draggedX.value - lastDraggedX.value)
    const distanceY = Math.abs(draggedY.value - lastDraggedY.value)

    switch (position) {
      case 'top':
      case 'top-left':
      case 'top-right':
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        if (distanceY > toValue(threshold).distance) {
          shouldClose.value = true
        } else {
          interpolateTo.value = 0
        }
        break

      case 'left':
      case 'right':
        if (distanceX > toValue(threshold).distance) {
          shouldClose.value = true
        } else {
          interpolateTo.value = 0
        }
        break
    }
  }

  function checkMomentum() {
    const elapsed = Date.now() - dragStart.value!.getTime()

    const distanceX = Math.abs(draggedX.value - lastDraggedX.value)
    const distanceY = Math.abs(draggedY.value - lastDraggedY.value)

    const velocityX = elapsed && distanceX ? distanceX / elapsed : 0
    const velocityY = elapsed && distanceY ? distanceY / elapsed : 0

    switch (position) {
      case 'top':
      case 'top-left':
      case 'top-right':
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        if (velocityY > 0.5) {
          shouldClose.value = true
        } else {
          interpolateTo.value = 0
        }
        break
      case 'left':
      case 'right':
        if (velocityX > 0.5) {
          shouldClose.value = true
        } else {
          interpolateTo.value = 0
        }
        break
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'top':
        const newDraggedTC = Math.min(y - originY.value, 0)
        draggedY.value = newDraggedTC
        break
      case 'top-left':
        const newDraggedTL = Math.min(y - originY.value, 0)
        draggedY.value = newDraggedTL
        break
      case 'top-right':
        const newDraggedTR = Math.min(y - originY.value, 0)
        draggedY.value = newDraggedTR
        break
      case 'bottom':
        const newDraggedBC = Math.max(y - originY.value, 0)
        draggedY.value = newDraggedBC
        break
      case 'bottom-left':
        const newDraggedBL = Math.max(y - originY.value, 0)
        draggedY.value = newDraggedBL
        break
      case 'bottom-right':
        const newDraggedBR = Math.max(y - originY.value, 0)
        draggedY.value = newDraggedBR
        break
      case 'left':
        const newDraggedCL = Math.min(x - originX.value, 0)
        draggedX.value = newDraggedCL
        break
      case 'right':
        const newDraggedCR = Math.max(x - originX.value, 0)
        draggedX.value = newDraggedCR
        break
    }
  }

  function resetStateAndListeners() {
    dragging.value = false
    shouldClose.value = false
    interpolateTo.value = undefined
    cancelTouchend?.()
    cancelPointerup?.()
    cancelPointermove?.()
    cancelTouchcancel?.()
  }

  function onPointerup(e: PointerEvent) {
    if (shouldClose.value) {
      deleteView(view.id)
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      interpolateDragged({
        to: interpolateTo.value,
      })
    } else {
      switch (position) {
        case 'top':
        case 'top-left':
        case 'top-right':
        case 'bottom':
        case 'bottom-left':
        case 'bottom-right':
          interpolateDragged({
            to: lastDraggedY.value,
          })
          break

        case 'left':
        case 'right':
          interpolateDragged({
            to: lastDraggedX.value,
          })
          break
      }
    }

    emitter.emit('afterDrag', {
      id: toValue(instanceId),
      x: draggedX.value,
      y: draggedY.value,
    })

    // Reset state
    resetStateAndListeners()

    // Unlock scroll
    const scrollLockValue = toValue(scrollLock)
    if (scrollLockValue) {
      unlockScroll(
        typeof scrollLockValue === 'object' && scrollLockValue.padding
      )
    }

    if (hasDragged.value) {
      e.preventDefault()
    }

    // Release pointer capture
    guardedReleasePointerCapture({ event: e, element: pointerdownTarget })
  }

  function onPointermove(e: PointerEvent) {
    // Prevent dragging with a secondary pointer
    if (e.isTrusted && !e.isPrimary) {
      return
    }

    // Prevent event bubbling, helpful on iOS
    e.stopImmediatePropagation()
    e.stopPropagation()

    // Reset shouldClose before checking
    shouldClose.value = false

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    //Check if we should close or snap based on momentum
    checkMomentum()

    // Check if we should close based on distance
    checkPosition()

    emitter.emit('drag', {
      id: toValue(instanceId),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function destroy() {
    cancelPointermove?.()
    cancelPointerup?.()
    cancelTouchend?.()
    cancelTouchcancel?.()
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Lock scroll as soon as the user starts dragging
    const scrollLockValue = toValue(scrollLock)
    if (scrollLockValue) {
      lockScroll(typeof scrollLockValue === 'object' && scrollLockValue.padding)
    }

    // Prevent dragging if we’re already dragging
    if (dragging.value) {
      return
    } else {
      // Save state
      dragging.value = true

      // Save pointerdown target and capture pointer
      // Capture the target, not the elRef, since this would break canDrag
      // canDrag traverses up the DOM tree, so we need the actual target
      pointerdownTarget = e.target as HTMLElement

      guardedSetPointerCapture({
        event: e,
        element: e.target as HTMLElement,
      })

      emitter.emit('beforeDrag', {
        id: toValue(instanceId),
        x: draggedX.value,
        y: draggedY.value,
      })

      // Save last dragged position,
      // used later to check if click event should propagate
      lastDraggedX.value = draggedX.value
      lastDraggedY.value = draggedY.value

      // Add listeners
      cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
      cancelTouchcancel = useEventListener(document, 'touchcancel', onPointerup)
      cancelPointermove = useEventListener(
        document,
        'pointermove',
        onPointermove,
        { passive: false }
      )

      // Pointerup doesn’t fire on iOS, so we need to use touchend
      cancelTouchend = isIOS()
        ? useEventListener(document, 'touchend', onPointerup)
        : undefined

      // Origin is the distance between pointer event and last dragged position
      originX.value = e.screenX - draggedX.value
      originY.value = e.screenY - draggedY.value

      // Save start time
      dragStart.value = new Date()

      // Set initial transform
      onPointermove(e)
    }
  }

  async function onClick(e: MouseEvent) {
    if (hasDragged.value) {
      e.preventDefault()
      return
    }

    if (position === 'left' || position === 'right') {
      return
    }

    if (state.options.layout?.expand === 'click') {
      state.expanded = true
    }
  }

  onScopeDispose(() => {
    destroy()
  })

  return {
    onPointerdown,
    onClick,
    style,
  }
}
