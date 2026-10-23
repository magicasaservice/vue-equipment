import {
  computed,
  markRaw,
  nextTick,
  onMounted,
  onScopeDispose,
  toRefs,
  toValue,
  watch,
} from 'vue'
import {
  unrefElement,
  useEventListener,
  useResizeObserver,
  useScrollLock,
  useThrottleFn,
} from '@vueuse/core'
import {
  cancelEdgeNavigation,
  guardedReleasePointerCapture,
  guardedSetPointerCapture,
  isAndroid,
  isIOS,
  isWithinRange,
  snapCommit,
  snapRelease,
} from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMagicDrawer } from './../useMagicDrawer'
import { useDrawerSnap } from './useDrawerSnap'
import { useDrawerGuards } from './useDrawerGuards'
import { useDrawerUtils } from './useDrawerUtils'
import { useDrawerState } from './useDrawerState'

import type { MaybeRef, Ref, WritableComputedRef } from 'vue'
import type { UseResizeObserverReturn } from '@vueuse/core'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { SnapDrag } from '@maas/vue-equipment/utils'

import type {
  MagicDrawerSnapPoint,
  MagicDrawerSnapRange,
  RequiredMagicDrawerOptions,
} from '../../types'

type UseDrawerDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  wrapperRef: Ref<HTMLDivElement | null>
  position: MaybeRef<RequiredMagicDrawerOptions['position']>
  snapPoints: MaybeRef<RequiredMagicDrawerOptions['snapPoints']>
  snap: MaybeRef<RequiredMagicDrawerOptions['snap']>
  threshold: MaybeRef<RequiredMagicDrawerOptions['threshold']>
  initial: MaybeRef<RequiredMagicDrawerOptions['initial']>
  animation: MaybeRef<RequiredMagicDrawerOptions['animation']>
  preventDragClose: MaybeRef<RequiredMagicDrawerOptions['preventDragClose']>
  preventEdgeNavigation: MaybeRef<
    RequiredMagicDrawerOptions['preventEdgeNavigation']
  >
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
    snap,
    overshoot,
    threshold,
    initial,
    animation,
    preventDragClose,
    preventEdgeNavigation,
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
    activeSnapPoint,
  } = toRefs(state)

  const { isActive, close } = useMagicDrawer(id)

  // The last pending snap target emitted, so willSnapTo only fires on change.
  // A target inside a range counts as the range itself.
  let lastPendingTarget: number | MagicDrawerSnapRange | undefined = undefined

  // The drag outpaces the momentum threshold, so a release carries on
  let flicked = false

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

  const snapMode = computed(() => toValue(snap).mode)

  const isVertical = computed(() => {
    const side = toValue(position)
    return side === 'top' || side === 'bottom'
  })

  // Snap logic
  const {
    snappedY,
    snappedX,
    drawerHeight,
    drawerWidth,
    mappedSnapPoints,
    mappedRanges,
    rangeAt,
    snapPointAt,
    restingOffset,
    isSnapTarget,
    snapTo,
    interpolateDragged,
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
    activeSnapPoint,
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

  // The drag along the drawer’s axis, for the shared snap rules
  function snapDrag(): SnapDrag {
    const layout = {
      points: mappedSnapPoints.value,
      ranges: mappedRanges.value,
      mode: snapMode.value,
    }

    return isVertical.value
      ? {
          ...layout,
          rest: snappedY.value,
          start: lastDraggedY.value,
          position: draggedY.value,
        }
      : {
          ...layout,
          rest: snappedX.value,
          start: lastDraggedX.value,
          position: draggedX.value,
        }
  }

  // Whether a release at an offset closes the drawer. Inside a range that
  // reaches the closed end, a drag toward it closes within the distance
  // threshold, as the pointer can’t follow the drawer past the window edge.
  function isClosing(offset: number) {
    const extent = isVertical.value ? drawerHeight.value : drawerWidth.value

    if (extent <= 0) {
      return false
    }

    if (Math.abs(offset) === extent) {
      return true
    }

    const side = toValue(position)
    const closed = side === 'bottom' || side === 'right' ? extent : -extent
    const rest = isVertical.value ? snappedY.value : snappedX.value
    const range = rangeAt(offset)
    const reachesClosed = range?.min === closed || range?.max === closed
    const towardClosed = Math.abs(closed - offset) < Math.abs(closed - rest)

    return (
      hasDragged.value &&
      reachesClosed &&
      towardClosed &&
      Math.abs(closed - offset) <= toValue(threshold).distance
    )
  }

  // Where a release comes to rest, rounded like any resting value
  function settleTarget() {
    const target = snapRelease({
      ...snapDrag(),
      committed: interpolateTo.value,
      flicked,
      tapped: !hasDragged.value,
    })

    return restingOffset(target)
  }

  function checkMomentum() {
    const elapsed = Date.now() - dragStart.value!.getTime()
    const { position: dragged, start } = snapDrag()
    const distance = Math.abs(dragged - start)
    const velocity = elapsed && distance ? distance / elapsed : 0

    flicked = velocity > toValue(threshold).momentum
  }

  function checkPosition() {
    const direction = isVertical.value
      ? relDirectionY.value
      : relDirectionX.value

    interpolateTo.value = snapCommit({
      ...snapDrag(),
      distance: toValue(threshold).distance,
      flicked,
      flickDirection: direction === 'absolute' ? undefined : direction,
    })

    // Close once a release would land where the drawer closes
    shouldClose.value = isClosing(settleTarget())
  }

  function emitWillSnapTo() {
    // Heading to close, not to a snap point
    if (shouldClose.value) {
      return
    }

    const target = settleTarget()
    const isPoint = mappedSnapPoints.value.includes(target)
    const pending = (!isPoint && rangeAt(target)?.range) || target

    // Inside a range the target follows the pointer, so only entering counts
    if (pending === lastPendingTarget) {
      return
    }
    lastPendingTarget = pending

    const snapPoint = snapPointAt(target)
    if (snapPoint === undefined) {
      return
    }

    emitter.emit('willSnapTo', {
      id: toValue(id),
      snapPoint,
    })
  }

  // Close, come to rest where the release lands, or animate back
  function settle(target: EventTarget) {
    if (shouldClose.value) {
      close()
      return
    }

    const destination = settleTarget()
    const snapped = isVertical.value ? snappedY.value : snappedX.value

    if (destination === snapped && interpolateTo.value === undefined) {
      interpolateDragged({ to: snapped })
      return
    }

    // Commit before interpolating, which emits afterSnap right away when
    // already in place
    activeSnapPoint.value = snapPointAt(destination)

    if (isVertical.value) {
      snappedY.value = destination
    } else {
      snappedX.value = destination
    }

    // If scroll is locked, interpolate to snap point
    // Scroll should only be locked at one end!
    if ((scrollLock && scrollLock.value) || canInterpolate(target)) {
      interpolateDragged({ to: destination })
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    const os = toValue(overshoot)

    switch (position) {
      case 'bottom': {
        const newDraggedB = clamp(y - originY.value, 0, os * -1, false)
        if (newDraggedB === draggedY.value) {
          break
        }

        relDirectionY.value = newDraggedB < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedB
        break
      }

      case 'top': {
        const newDraggedT = clamp(y - originY.value, 0, os, true)
        if (newDraggedT === draggedY.value) {
          break
        }

        relDirectionY.value = newDraggedT < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedT
        break
      }

      case 'right': {
        const newDraggedR = clamp(x - originX.value, 0, os * -1, false)
        if (newDraggedR === draggedX.value) {
          break
        }

        relDirectionX.value = newDraggedR < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedR
        break
      }

      case 'left': {
        const newDraggedL = clamp(x - originX.value, 0, os, true)
        if (newDraggedL === draggedX.value) {
          break
        }

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

  // A drawer that isn’t measured yet can’t map snap points, and snapTo bails
  // on its own, so only a measured drawer rejects a point
  function isUnknownSnapPoint(snapPoint: MagicDrawerSnapPoint) {
    return !!wrapperRect.value && !isSnapTarget(snapPoint)
  }

  function snapToCallback(payload: MagicEmitterEvents['snapTo']) {
    if (payload.id === toValue(id)) {
      const snapPoint = payload.snapPoint as MagicDrawerSnapPoint

      if (!toValue(isActive)) {
        logWarning('Cannot snap to point when drawer is not open')
        return
      } else if (isUnknownSnapPoint(snapPoint)) {
        logWarning(
          `Cannot snap to ${snapPoint}, which is neither a snap point nor inside a range`
        )
        return
      } else {
        snapTo({
          snapPoint,
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
    checkDirection({ x: e.clientX, y: e.clientY })

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
    setDragged({ x: e.clientX, y: e.clientY })

    //Check if we should close or snap based on momentum
    checkMomentum()

    // Check if we should close based on distance
    checkPosition()

    // Emit the committed snap target if it changed
    emitWillSnapTo()

    emitter.emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function onPointerup(e: PointerEvent) {
    settle(e.target!)

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
    checkDirection({ x: firstTouch.clientX, y: firstTouch.clientY })

    // Reset shouldClose before checking
    shouldClose.value = false

    // Save pointermove direction
    checkDirection({ x: firstTouch.clientX, y: firstTouch.clientY })

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
    setDragged({ x: firstTouch.clientX, y: firstTouch.clientY })

    //Check if we should close or snap based on momentum
    checkMomentum()

    // Check if we should close based on distance
    checkPosition()

    // Emit the committed snap target if it changed
    emitWillSnapTo()

    emitter.emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function onTouchend(e: TouchEvent) {
    settle(e.target!)

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

      // Reset the pending snap target for the new gesture
      lastPendingTarget = undefined
      flicked = false

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
    // Pointerup does not fire on iOS, use touchend instead
    cancelTouchend =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchend', onTouchend)
        : undefined
    cancelTouchcancel =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchcancel', onTouchend)
        : undefined

    // Origin is the distance between pointer event and last dragged position
    originX.value = e.clientX - draggedX.value
    originY.value = e.clientY - draggedY.value

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)
  }

  function onTouchstart(e: TouchEvent) {
    switch (position) {
      case 'left':
      case 'right':
        // Horizontal drawers drag along the axis of WebKit’s back and forward
        // navigation swipe; canceling touchstart near the viewport edge keeps
        // the drag with the drawer
        if (toValue(preventEdgeNavigation)) {
          cancelEdgeNavigation({ event: e })
        }
        break
    }

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

      // Reset the pending snap target for the new gesture
      lastPendingTarget = undefined
      flicked = false

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
    originX.value = firstTouch.clientX - draggedX.value
    originY.value = firstTouch.clientY - draggedY.value

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

      if (!snapPoint) {
        return
      }

      if (isUnknownSnapPoint(snapPoint)) {
        logWarning(
          `initial.snapPoint (${snapPoint}) is neither a snap point nor inside a range and is ignored`
        )
        return
      }

      snapTo({ snapPoint, interpolate: false })
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
  resizeObserverEl = useResizeObserver(elRef, async () => {
    useThrottleFn(async () => {
      await getSizes()

      if (activeSnapPoint.value) {
        await snapTo({ snapPoint: activeSnapPoint.value, interpolate: false })
      }
    }, 100)()
  })

  onScopeDispose(() => {
    destroy()
  }, true)

  return {
    onPointerdown,
    onTouchstart,
    onTouchmove,
    onClick,
    style,
    hasDragged,
  }
}
