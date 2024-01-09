import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  toValue,
  type MaybeRef,
} from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'
import { useDrawerEmitter } from '../useDrawerEmitter'
import { defaultOptions } from '../../utils/defaultOptions'
import { type DrawerEvents } from '../../types'

type UseDrawerDragArgs = {
  elRef: MaybeRef<HTMLDivElement | undefined>
  position: MaybeRef<typeof defaultOptions.position>
  threshold: MaybeRef<typeof defaultOptions.threshold>
  overshoot: MaybeRef<number>
  close: () => void
}

export function useDrawerDrag(args: UseDrawerDragArgs) {
  const { elRef, position, overshoot, threshold, close } = args

  // Private state
  const dragStart = ref<Date | undefined>(undefined)
  const originX = ref(0)
  const originY = ref(0)
  const dragging = ref(false)
  const shouldClose = ref(false)

  const elRect = ref<DOMRect | undefined>(undefined)

  let cancelPointermove: (() => void) | undefined = undefined

  // Public state
  const draggedX = ref(0)
  const draggedY = ref(0)

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  // Private functions
  function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
  }

  function checkPosition() {
    switch (position) {
      case 'bottom':
        if (draggedY.value > toValue(threshold).distance) {
          shouldClose.value = true
        }
        break
      case 'top':
        if (draggedY.value < toValue(threshold).distance * -1) {
          shouldClose.value = true
        }
        break
      case 'right':
        if (draggedX.value > toValue(threshold).distance) {
          shouldClose.value = true
        }
        break
      case 'left':
        if (draggedX.value < toValue(threshold).distance * -1) {
          shouldClose.value = true
        }
        break
    }
  }

  function checkMomentum({ x, y }: { x: number; y: number }) {
    const elapsed = Date.now() - dragStart.value!.getTime()

    const velocityX = (x - originX.value) / elapsed
    const velocityY = (y - originY.value) / elapsed

    switch (position) {
      case 'bottom':
        if (velocityY > toValue(threshold).momentum) {
          shouldClose.value = true
        }
        break
      case 'top':
        if (velocityY < toValue(threshold).momentum * -1) {
          shouldClose.value = true
        }
        break
      case 'right':
        if (velocityX > toValue(threshold).momentum) {
          shouldClose.value = true
        }
        break
      case 'left':
        if (velocityX < toValue(threshold).momentum * -1) {
          shouldClose.value = true
        }
        break
    }
  }

  function clamp(value: number, from: number, to: number) {
    if (from > to) {
      if (value > from) return value
      if (value < to) return to
      else return value
    } else if (from < to) {
      if (value < from) return value
      if (value > to) return to
      else return value
    } else {
      return value
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        draggedY.value = clamp(y - originY.value, 0, toValue(overshoot) * -1)
        break
      case 'top':
        draggedY.value = clamp(y - originY.value, 0, toValue(overshoot))
        break
      case 'right':
        draggedX.value = clamp(x - originX.value, 0, toValue(overshoot) * -1)
        break
      case 'left':
        draggedX.value = clamp(x - originX.value, 0, toValue(overshoot))
        break
    }
  }

  function resetStateAndListeners() {
    dragging.value = false
    cancelPointermove?.()
  }

  function resetDragged() {
    draggedX.value = 0
    draggedY.value = 0
  }

  function emitterCallback(
    event: keyof DrawerEvents,
    _payload: DrawerEvents[keyof DrawerEvents]
  ) {
    if (event === 'afterLeave') {
      resetDragged()
    }
  }

  function onPointerup(e: PointerEvent) {
    resetStateAndListeners()

    if (shouldClose.value) {
      close()
    } else {
      switch (position) {
        case 'bottom':
        case 'top':
          interpolate({
            from: draggedY.value,
            to: 0,
            duration: 50,
            callback: (value: number) => {
              draggedY.value = value
            },
          })
          break
        case 'right':
        case 'left':
          interpolate({
            from: draggedX.value,
            to: 0,
            duration: 50,
            callback: (value: number) => {
              draggedX.value = value
            },
          })
          break
      }
    }

    // Prevent accidental click events
    e.preventDefault()
  }

  function onPointermove(e: PointerEvent) {
    // Reset shouldClose before checking
    shouldClose.value = false

    //Check if we should close based on momentum
    checkMomentum({ x: e.screenX, y: e.screenY })

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    // Check if we should close based on distance
    checkPosition()

    e.preventDefault()
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Prevent dragging if we're already dragging
    if (dragging.value) {
      return
    } else {
      dragging.value = true
    }

    // Make sure maintain pointer capture so that we keep receiving events
    ;(e.target! as HTMLElement).setPointerCapture(e.pointerId)

    // Add listeners
    useEventListener(document, 'pointerup', onPointerup)
    cancelPointermove = useEventListener(document, 'pointermove', onPointermove)

    // Save origin
    originX.value = e.screenX
    originY.value = e.screenY

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)

    e.preventDefault()
  }

  // Lifecycle hooks and listeners
  onMounted(() => {
    getSizes()
    useDrawerEmitter().on('*', emitterCallback)
  })

  watch(
    () => unrefElement(elRef),
    () => {
      getSizes()
    }
  )

  onBeforeUnmount(() => {
    useDrawerEmitter().off('*', emitterCallback)
  })

  return {
    style,
    dragging,
    onPointerdown,
  }
}
