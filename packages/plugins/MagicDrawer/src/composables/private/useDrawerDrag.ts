import {
  computed,
  onMounted,
  watch,
  toValue,
  toRefs,
  nextTick,
  onScopeDispose,
  markRaw,
  type Ref,
  type MaybeRef,
  type WritableComputedRef,
} from 'vue'
import {
  useEventListener,
  unrefElement,
  useResizeObserver,
  useThrottleFn,
  useScrollLock,
  type UseResizeObserverReturn,
} from '@vueuse/core'
import {
  guardedReleasePointerCapture,
  guardedSetPointerCapture,
  isAndroid,
  isIOS,
  isWithinRange,
} from '@maas/vue-equipment/utils'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMagicDrawer } from './../useMagicDrawer'
import { useDrawerSnap } from './useDrawerSnap'
import { useDrawerGuards } from './useDrawerGuards'
import { useDrawerUtils } from './useDrawerUtils'
import { useDrawerState } from './useDrawerState'

import type { DrawerSnapPoint, DrawerDefaultOptions } from '../../types'

type UseDrawerDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  wrapperRef: Ref<HTMLDivElement | null>
  position: MaybeRef<DrawerDefaultOptions['position']>
  snapPoints: MaybeRef<DrawerDefaultOptions['snapPoints']>
  threshold: MaybeRef<DrawerDefaultOptions['threshold']>
  initial: MaybeRef<DrawerDefaultOptions['initial']>
  animation: MaybeRef<DrawerDefaultOptions['animation']>
  preventDragClose: MaybeRef<DrawerDefaultOptions['preventDragClose']>
  disabled: MaybeRef<boolean>
  overshoot: MaybeRef<number>
}

export function useDrawerDrag(args: UseDrawerDragArgs) {
  const {
    id,
    elRef,
    wrapperRef,
    position,
    snapPoints,
    overshoot,
    threshold,
    initial,
    animation,
    preventDragClose,
    disabled,
  } = args

  const { logWarning } = useMagicError({
    prefix: 'MagicDrawer',
    source: 'useDrawerDrag',
  })

  // Private state
  const { initializeState } = useDrawerState(toValue(id))
  const state = initializeState()
  const {
    dragStart,
    dragging,
    wheeling,
    shouldClose,
    interpolateTo,
    originX,
    originY,
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
    relDirectionX,
    relDirectionY,
    absDirectionX,
    absDirectionY,
    elRect,
    wrapperRect,
  } = toRefs(state)

  const { isActive, close } = useMagicDrawer(id)

  let pointerdownTarget: HTMLElement | undefined = undefined
  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelPointercancel: (() => void) | undefined = undefined
  let cancelTouchmove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined
  let cancelTouchcancel: (() => void) | undefined = undefined
  let scrollLock: WritableComputedRef<boolean> | undefined = undefined
  let resizeObserverEl: UseResizeObserverReturn | null = null

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

  // Snap logic
  const {
    snappedY,
    snappedX,
    activeSnapPoint,
    snapTo,
    snapPointsMap,
    interpolateDragged,
    findClosestSnapPoint,
    drawerHeight,
    drawerWidth,
  } = useDrawerSnap({
    id,
    wrapperRect,
    animation,
    snapPoints,
    preventDragClose,
    position,
    overshoot,
    draggedY,
    draggedX,
  })

  const { canDrag, canInterpolate, lockScroll } = useDrawerGuards({
    elRef,
    absDirectionX,
    absDirectionY,
    position,
    activeSnapPoint,
  })

  const { clamp } = useDrawerUtils()

  // Private functions
  const emitter = useMagicEmitter()

  async function getSizes() {
    const el = unrefElement(elRef)
    const wrapper = unrefElement(wrapperRef)

    elRect.value = el ? markRaw(el.getBoundingClientRect()) : undefined
    wrapperRect.value = wrapper
      ? markRaw(wrapper.getBoundingClientRect())
      : undefined
    await nextTick()
  }

  function checkPosition() {
    const distanceX = Math.abs(draggedX.value - lastDraggedX.value)
    const distanceY = Math.abs(draggedY.value - lastDraggedY.value)

    switch (position) {
      case 'bottom':
      case 'top': {
        if (distanceY > toValue(threshold).distance) {
          const snapPointY = findClosestSnapPoint({
            draggedX: 0,
            draggedY,
            direction: relDirectionY.value,
          })

          // Close if last snap point is reached
          if (Math.abs(snapPointY ?? 0) === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointY
          }
        }

        break
      }

      case 'right':
      case 'left': {
        if (distanceX > toValue(threshold).distance) {
          const snapPointX = findClosestSnapPoint({
            draggedX,
            draggedY: 0,
            direction: relDirectionX.value,
          })

          // Close if last snap point is reached
          if (Math.abs(snapPointX ?? 0) === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointX
          }
        }
        break
      }
    }
  }

  function checkMomentum() {
    const elapsed = Date.now() - dragStart.value!.getTime()

    const distanceX = Math.abs(draggedX.value - lastDraggedX.value)
    const distanceY = Math.abs(draggedY.value - lastDraggedY.value)

    const velocityX = elapsed && distanceX ? distanceX / elapsed : 0
    const velocityY = elapsed && distanceY ? distanceY / elapsed : 0

    switch (position) {
      case 'bottom':
      case 'top': {
        if (velocityY > toValue(threshold).momentum) {
          const snapPointY = findClosestSnapPoint({
            draggedX: 0,
            draggedY,
            direction: relDirectionY.value,
          })
          // Close if last snap point is reached
          if (Math.abs(snapPointY ?? 0) === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointY
          }
        }
        break
      }

      case 'right':
      case 'left': {
        if (velocityX > toValue(threshold).momentum) {
          const snapPointX = findClosestSnapPoint({
            draggedX,
            draggedY,
            direction: relDirectionX.value,
          })

          // Close if last snap point is reached
          if (Math.abs(snapPointX ?? 0) === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointX
          }
        }
        break
      }
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom': {
        const newDraggedB = clamp(y - originY.value, 0, toValue(overshoot) * -1)
        if (newDraggedB === draggedY.value) break

        relDirectionY.value = newDraggedB < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedB
        break
      }

      case 'top': {
        const newDraggedT = clamp(y - originY.value, 0, toValue(overshoot))
        if (newDraggedT === draggedY.value) break

        relDirectionY.value = newDraggedT < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedT
        break
      }

      case 'right': {
        const newDraggedR = clamp(x - originX.value, 0, toValue(overshoot) * -1)
        if (newDraggedR === draggedX.value) break

        relDirectionX.value = newDraggedR < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedR
        break
      }

      case 'left': {
        const newDraggedL = clamp(x - originX.value, 0, toValue(overshoot))
        if (newDraggedL === draggedX.value) break

        relDirectionX.value = newDraggedL < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedL
        break
      }
    }
  }

  function checkDirection({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        absDirectionY.value =
          y < originY.value ? 'with' : y > originY.value ? 'against' : undefined
        break

      case 'top':
        absDirectionY.value =
          y > originY.value ? 'with' : y < originY.value ? 'against' : undefined
        break

      case 'right':
        absDirectionX.value =
          x < originX.value ? 'with' : x > originX.value ? 'against' : undefined
        break

      case 'left':
        absDirectionX.value =
          x > originX.value ? 'with' : x < originX.value ? 'against' : undefined
        break
    }
  }

  function resetListeners() {
    cancelTouchmove?.()
    cancelTouchend?.()
    cancelTouchcancel?.()
    cancelPointerup?.()
    cancelPointermove?.()
    cancelPointercancel?.()
  }

  function resetScrollLock() {
    if (scrollLock?.value) {
      scrollLock.value = false
    }

    scrollLock = undefined
  }

  function resetDragState() {
    dragging.value = false
    shouldClose.value = false
    interpolateTo.value = undefined
  }

  function resetCalcState() {
    draggedX.value = 0
    draggedY.value = 0
    lastDraggedX.value = 0
    lastDraggedY.value = 0
    originX.value = 0
    originY.value = 0
    elRect.value = undefined
    wrapperRect.value = undefined
  }

  function resetSnapState() {
    snappedX.value = 0
    snappedY.value = 0
    activeSnapPoint.value = undefined
  }

  function afterLeaveCallback(payload: MagicEmitterEvents['afterLeave']) {
    if (payload === toValue(id)) {
      resetCalcState()
      resetSnapState()
    }
  }

  function snapToCallback(payload: MagicEmitterEvents['snapTo']) {
    if (payload.id === toValue(id)) {
      if (!toValue(isActive)) {
        logWarning('Cannot snap to point when drawer is not open')
        return
      } else {
        snapTo({
          snapPoint: payload.snapPoint as DrawerSnapPoint,
          interpolate: true,
          duration: payload.duration,
        })
      }
    }
  }

  async function initialize() {
    await getSizes()
    emitter.on('snapTo', snapToCallback)
    emitter.on('afterLeave', afterLeaveCallback)
  }

  function destroy() {
    emitter.off('snapTo', snapToCallback)
    emitter.off('afterLeave', afterLeaveCallback)
    resizeObserverEl?.stop()
    resetDragState()
    resetListeners()
  }

  function onCancel() {
    switch (position) {
      case 'bottom':
      case 'top':
        interpolateDragged({
          to: snappedY.value,
        })
        break

      case 'right':
      case 'left':
        interpolateDragged({
          to: snappedX.value,
        })
        break
    }

    resetDragState()
    resetListeners()
    resetScrollLock()
  }

  function onPointermove(e: PointerEvent) {
    // Prevent real mousemove while wheeling
    if (e.isTrusted && wheeling.value) {
      return
    }

    // Prevent dragging with a secondary pointer
    if (e.isTrusted && !e.isPrimary) {
      return
    }

    // Prevent event bubbling
    e.stopImmediatePropagation()
    e.stopPropagation()

    // Reset shouldClose before checking
    shouldClose.value = false

    // Save pointermove direction
    checkDirection({ x: e.screenX, y: e.screenY })

    // Possibly lock scroll
    if (!scrollLock) {
      const scrollLockTarget = lockScroll(e.target!)
      if (scrollLockTarget) {
        scrollLock = useScrollLock(scrollLockTarget)
        scrollLock.value = true
      }
    }

    // Check if we should be dragging
    const dragTarget = pointerdownTarget ?? (e.target as HTMLElement)
    if (!canDrag(dragTarget)) {
      return
    }

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    //Check if we should close or snap based on momentum
    checkMomentum()

    // Check if we should close based on distance
    checkPosition()

    emitter.emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function onPointerup(e: PointerEvent) {
    if (shouldClose.value) {
      close()
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      // If scroll is locked, interpolate to snap point
      // Scroll should only be locked at one end!
      if ((scrollLock && scrollLock.value) || canInterpolate(e.target!)) {
        interpolateDragged({
          to: interpolateTo.value,
        })
      }

      // Save the snap point we’re snapping to
      // both the input value, as well as the actual pixel value
      activeSnapPoint.value = snapPointsMap.value[interpolateTo.value]

      switch (position) {
        case 'bottom':
        case 'top':
          snappedY.value = interpolateTo.value
          break

        case 'right':
        case 'left':
          snappedX.value = interpolateTo.value
          break
      }
    } else {
      switch (position) {
        case 'bottom':
        case 'top':
          interpolateDragged({
            to: snappedY.value,
          })
          break

        case 'right':
        case 'left':
          interpolateDragged({
            to: snappedX.value,
          })
          break
      }
    }

    emitter.emit('afterDrag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })

    // Reset state
    resetDragState()
    resetListeners()
    resetScrollLock()

    if (hasDragged.value) {
      e.preventDefault()
    }

    // Release pointer capture
    guardedReleasePointerCapture({ event: e, element: pointerdownTarget })
  }

  function onTouchmove(e: TouchEvent) {
    // Prevent event bubbling
    e.stopImmediatePropagation()
    e.stopPropagation()

    // Reset shouldClose before checking
    shouldClose.value = false

    const firstTouch = e.touches[0]
    if (!firstTouch) {
      return
    }

    // Save pointermove direction
    checkDirection({ x: firstTouch.screenX, y: firstTouch.screenY })

    // Reset shouldClose before checking
    shouldClose.value = false

    // Save pointermove direction
    checkDirection({ x: firstTouch.screenX, y: firstTouch.screenY })

    // Possibly lock scroll
    if (!scrollLock) {
      const scrollLockTarget = lockScroll(firstTouch.target)
      if (scrollLockTarget) {
        scrollLock = useScrollLock(scrollLockTarget)
        scrollLock.value = true
      }
    }

    // Check if we should be dragging
    const dragTarget = pointerdownTarget ?? (e.target as HTMLElement)
    if (!canDrag(dragTarget)) {
      return
    }

    // Prevent default if we have dragged
    if (hasDragged.value) {
      e.preventDefault()
    }

    // Save dragged value
    setDragged({ x: firstTouch.screenX, y: firstTouch.screenY })

    //Check if we should close or snap based on momentum
    checkMomentum()

    // Check if we should close based on distance
    checkPosition()

    emitter.emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function onTouchend(e: TouchEvent) {
    if (shouldClose.value) {
      close()
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      // If scroll is locked, interpolate to snap point
      // Scroll should only be locked at one end!
      if ((scrollLock && scrollLock.value) || canInterpolate(e.target!)) {
        interpolateDragged({
          to: interpolateTo.value,
        })
      }

      // Save the snap point we’re snapping to
      // both the input value, as well as the actual pixel value
      activeSnapPoint.value = snapPointsMap.value[interpolateTo.value]

      switch (position) {
        case 'bottom':
        case 'top':
          snappedY.value = interpolateTo.value
          break

        case 'right':
        case 'left':
          snappedX.value = interpolateTo.value
          break
      }
    } else {
      switch (position) {
        case 'bottom':
        case 'top':
          interpolateDragged({
            to: snappedY.value,
          })
          break

        case 'right':
        case 'left':
          interpolateDragged({
            to: snappedX.value,
          })
          break
      }
    }

    emitter.emit('afterDrag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })

    // Reset state
    resetDragState()
    resetListeners()
    resetScrollLock()

    if (hasDragged.value) {
      e.preventDefault()
    }
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Prevent dragging if we’re already dragging
    if (dragging.value) {
      return
    } else {
      // Bail early for select elements
      // Prevents a bug in safari related to pointer capture
      const isSelect = ['SELECT', 'OPTION'].includes(
        (e.target as HTMLElement).tagName
      )

      if (isSelect) {
        return
      }

      // Save state
      dragging.value = true

      // Save pointerdown target and capture pointer
      // Capture the target, not the elRef, since this would break canDrag
      // canDrag traverses up the DOM tree, so we need the actual target
      pointerdownTarget = e.target as HTMLElement
      guardedSetPointerCapture({
        event: e,
        element: pointerdownTarget,
      })

      emitter.emit('beforeDrag', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
    }

    // Save last dragged position,
    // used later to check if click event should propagate
    lastDraggedX.value = draggedX.value
    lastDraggedY.value = draggedY.value

    // Reset listeners to avoid memory leaks
    resetListeners()

    // Add listeners
    cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
    cancelPointercancel = useEventListener(
      document,
      'pointercancel',
      onPointerup
    )
    cancelPointermove = useEventListener(
      document,
      'pointermove',
      onPointermove,
      { passive: false }
    )

    // Add touch listeners for Android and iOS
    cancelTouchmove = isAndroid()
      ? useEventListener(document, 'touchmove', onTouchmove, {
          passive: false,
        })
      : undefined
    cancelTouchend =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchend', onTouchend)
        : undefined
    cancelTouchcancel =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchcancel', onTouchend)
        : undefined

    // Origin is the distance between pointer event and last dragged position
    originX.value = e.screenX - draggedX.value
    originY.value = e.screenY - draggedY.value

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)
  }

  function onTouchstart(e: TouchEvent) {
    // Only handle touch on Android
    if (!isAndroid()) {
      return
    }

    if (dragging.value) {
      return
    } else {
      // Bail early for select elements
      // Prevents a bug in safari related to pointer capture
      const isSelect = ['SELECT', 'OPTION'].includes(
        (e.target as HTMLElement).tagName
      )

      if (isSelect) {
        return
      }

      e.stopImmediatePropagation()
      e.stopPropagation()

      // Save state
      dragging.value = true

      // Save pointerdown target
      // Capture the target, not the elRef, since this would break canDrag
      pointerdownTarget = e.target as HTMLElement

      emitter.emit('beforeDrag', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
    }

    cancelTouchmove?.()
    cancelTouchmove = useEventListener(document, 'touchmove', onTouchmove, {
      passive: false,
    })
    cancelTouchend?.()
    cancelTouchend = useEventListener(document, 'touchend', onTouchend, {
      passive: false,
    })
    cancelTouchcancel?.()
    cancelTouchcancel = useEventListener(document, 'touchcancel', onTouchend)

    const firstTouch = e.touches[0]
    if (!firstTouch) {
      return
    }

    // Origin is the distance between pointer event and last dragged position
    originX.value = firstTouch.screenX - draggedX.value
    originY.value = firstTouch.screenY - draggedY.value

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onTouchmove(e)
  }

  function onClick(e: MouseEvent) {
    if (hasDragged.value) {
      e.preventDefault()
    }
  }

  // Lifecycle hooks and listeners
  onMounted(async () => {
    await initialize()
  })

  watch(
    () => [unrefElement(elRef), unrefElement(wrapperRef)],
    async () => {
      await getSizes()
      const snapPoint = toValue(initial)?.snapPoint

      if (snapPoint) {
        snapTo({ snapPoint, interpolate: false })
      }
    }
  )

  watch([snappedX, snappedY], ([x, y]) => {
    lastDraggedX.value = x
    lastDraggedY.value = y
  })

  // If the disabled value is updated and true, reset everything
  watch(
    () => toValue(disabled),
    (value) => {
      if (value) {
        onCancel()
      }
    }
  )

  // Make sure the drawer keeps the correct position when the window is resized
  // To achieve this, we update the snapPointsMap after the drawer has snapped
  resizeObserverEl = useResizeObserver(elRef, async () => {
    useThrottleFn(async () => {
      await getSizes()

      if (activeSnapPoint.value) {
        await snapTo({ snapPoint: activeSnapPoint.value, interpolate: false })
        snapPointsMap.trigger()
      }
    }, 100)()
  })

  onScopeDispose(() => {
    destroy()
  })

  return {
    onPointerdown,
    onTouchstart,
    onTouchmove,
    onClick,
    style,
    hasDragged,
  }
}
