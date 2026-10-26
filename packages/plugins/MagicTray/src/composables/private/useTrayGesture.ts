import { computed, onScopeDispose, readonly, ref, toValue, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  cancelEdgeNavigation,
  guardedReleasePointerCapture,
  guardedSetPointerCapture,
  isAndroid,
  isIOS,
  isWithinRange,
  lockSelection,
  snapCommit,
  snapRelease,
} from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useTraySnap } from './useTraySnap'
import { SIDES, useTrayUtils } from './useTrayUtils'

import type { MaybeRef, MaybeRefOrGetter } from 'vue'
import type { SnapDrag } from '@maas/vue-equipment/utils'

import type { MagicTraySide, MagicTraySnapRange, TrayState } from '../../types'

type UseTrayGestureArgs = {
  id: MaybeRef<string>
  state: TrayState
  selectionLock?: 'press' | 'drag'
  preventEdgeNavigation: MaybeRefOrGetter<boolean>
}

// One press, drag, and release on a side. Every handle and trigger runs its
// own gesture, while the side’s position lives in the shared state.
export function useTrayGesture(args: UseTrayGestureArgs) {
  const { id, state, selectionLock = 'press', preventEdgeNavigation } = args

  const { clampWithOvershoot, isVertical, isDraggableSide } = useTrayUtils()
  const emitter = useMagicEmitter()

  const {
    maxInset,
    mappedSnapPoints,
    mappedRanges,
    rangeAt,
    snapPointAt,
    restingInset,
    findSnapTarget,
    interpolateDragged,
  } = useTraySnap({ id, state })

  // Private state
  // The last pending snap target emitted, so willSnapTo only fires on change.
  // A target inside a range counts as the range itself.
  let lastPendingTarget: number | MagicTraySnapRange | undefined = undefined

  // A snap drag moved inside a range without emitting its snap events
  let heldRangeSnap = false

  // The drag outpaces the momentum threshold, so a release carries on
  let flicked = false

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelPointercancel: (() => void) | undefined = undefined
  let cancelTouchmove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined
  let cancelTouchcancel: (() => void) | undefined = undefined
  let pointerdownTarget: Element | null = null
  let releaseSelection: (() => void) | undefined = undefined

  const threshold = computed(() => state.options.threshold)
  const disabled = computed(() => state.options.disabled)
  const snapMode = computed(() => state.options.snap.mode)
  const dragMode = computed(() => state.options.drag.mode)

  // Public state
  // This gesture drives the current drag, as opposed to another handle or
  // trigger of the same tray
  const active = ref(false)

  // Measured from where the press began while dragging, from the resting snap
  // point otherwise, so a settling side counts as dragged until it arrives
  const hasDragged = computed(() => {
    const sides = state.draggingSide ? [state.draggingSide] : SIDES

    return sides.some(
      (side) =>
        !isWithinRange({
          input: state.dragged[side],
          base: state.lastDragged[side],
          threshold: toValue(threshold).lock,
        })
    )
  })

  // Private functions
  // A trigger waits for the drag to pass the lock threshold, so a long press
  // on its content still selects text
  function lockSelectionOnce() {
    releaseSelection ??= lockSelection()
  }

  // A press begins a drag once the tray is measured and enabled, the side has
  // snap points, and no other handle or trigger drives a drag
  function canBegin(side: MagicTraySide) {
    return (
      !state.dragging &&
      !toValue(disabled) &&
      state.elRect !== undefined &&
      isDraggableSide({ snapPoints: state.options.snapPoints, side })
    )
  }

  // Drag range bounded by the outermost snap points, capped by the opposite side
  function dragBounds(side: MagicTraySide) {
    const points = mappedSnapPoints(side)
    const geometricMax = maxInset(side)

    if (!points.length) {
      return { min: 0, max: geometricMax }
    }

    return {
      min: Math.max(0, points[0]!),
      max: Math.min(points[points.length - 1]!, geometricMax),
    }
  }

  // A side’s drag along its axis, for the shared snap rules
  function snapDrag(side: MagicTraySide): SnapDrag {
    return {
      points: mappedSnapPoints(side),
      ranges: mappedRanges(side),
      mode: snapMode.value,
      rest: state.snapped[side],
      start: state.lastDragged[side],
      position: state.dragged[side],
    }
  }

  // Where a release comes to rest, rounded like any resting value
  function settleTarget(side: MagicTraySide) {
    const target = snapRelease({
      ...snapDrag(side),
      committed: state.interpolateTo,
      flicked,
      tapped: !hasDragged.value,
    })

    return restingInset(side, target)
  }

  function isSnapDrag(side: MagicTraySide) {
    return typeof dragMode.value === 'string'
      ? dragMode.value === 'snap'
      : (dragMode.value?.[side] ?? 'free') === 'snap'
  }

  // The raw pointer-relative inset for a side, rubber-banded past its outermost
  // snap points. Shared by free dragging and the snap-drag read-out below.
  function computeInset(side: MagicTraySide, coord: number) {
    let newInset = 0

    switch (side) {
      case 'top':
        newInset = coord - state.origin
        break
      case 'bottom':
        newInset = state.origin - coord
        break
      case 'left':
        newInset = coord - state.origin
        break
      case 'right':
        newInset = state.origin - coord
        break
    }

    const { min, max } = dragBounds(side)
    return clampWithOvershoot(
      newInset,
      min,
      max,
      state.overshoot.outer[side],
      state.overshoot.inner
    )
  }

  function setDragged(side: MagicTraySide, coord: number) {
    const newInset = computeInset(side, coord)

    if (newInset === state.dragged[side]) {
      return
    }

    const prev = state.dragged[side]
    state.relDirection[side] = newInset < prev ? 'below' : 'above'
    state.dragged[side] = newInset
  }

  // Commit straight to whichever configured point the pointer is nearest,
  // instead of following it freely: a hard cut, no interpolation. Leaves
  // `lastDragged` untouched so `hasDragged` still reflects the gesture’s start,
  // which is what lets a genuine tap on the handle pass its click through.
  function snapDragged(side: MagicTraySide, coord: number) {
    const inset = computeInset(side, coord)
    const target = findSnapTarget(side, inset)

    if (target === undefined || target === state.snapped[side]) {
      return
    }

    state.dragged[side] = target
    state.snapped[side] = target
    state.activeSnapPoint[side] = snapPointAt(side, target)

    // Inside a range the edge follows the pointer, so its snap events wait
    // for a configured point or the release
    heldRangeSnap = !mappedSnapPoints(side).includes(target)

    if (!heldRangeSnap) {
      emitSnap(side)
    }
  }

  // Snap-drag sides already rest on their committed point; one released
  // inside a range still owes its snap events
  function releaseSnapDrag(side: MagicTraySide) {
    if (heldRangeSnap) {
      emitSnap(side)
    }

    heldRangeSnap = false
  }

  function emitSnap(side: MagicTraySide) {
    const point = state.activeSnapPoint[side]

    if (point === undefined) {
      return
    }

    emitter.emit('beforeSnap', {
      id: toValue(id),
      snapPoint: { side, point },
    })
    emitter.emit('afterSnap', {
      id: toValue(id),
      snapPoint: { side, point },
    })
  }

  function checkPosition(side: MagicTraySide) {
    const direction = state.relDirection[side]

    state.interpolateTo = snapCommit({
      ...snapDrag(side),
      distance: toValue(threshold).distance,
      flicked,
      flickDirection: direction === 'absolute' ? undefined : direction,
    })
  }

  function emitWillSnapTo(side: MagicTraySide) {
    const target = settleTarget(side)
    const isPoint = mappedSnapPoints(side).includes(target)
    const pending = (!isPoint && rangeAt(side, target)?.range) || target

    // Inside a range the target follows the pointer, so only entering counts
    if (pending === lastPendingTarget) {
      return
    }
    lastPendingTarget = pending

    const snapPoint = snapPointAt(side, target)
    if (snapPoint === undefined) {
      return
    }

    emitter.emit('willSnapTo', {
      id: toValue(id),
      side,
      snapPoint,
    })
  }

  function checkMomentum(side: MagicTraySide) {
    const elapsed = Date.now() - state.dragStart!.getTime()
    const distance = Math.abs(state.dragged[side] - state.lastDragged[side])
    const velocity = elapsed && distance ? distance / elapsed : 0

    flicked = velocity > toValue(threshold).momentum
  }

  function resetListeners() {
    cancelTouchmove?.()
    cancelTouchend?.()
    cancelTouchcancel?.()
    cancelPointerup?.()
    cancelPointermove?.()
    cancelPointercancel?.()
  }

  function resetDragState() {
    const side = state.draggingSide

    // A release rests at the snap point, so hasDragged clears once it arrives
    if (side) {
      state.lastDragged[side] = state.snapped[side]
    }

    releaseSelection?.()
    releaseSelection = undefined
    active.value = false
    state.dragging = false
    state.draggingSide = undefined
    state.interpolateTo = undefined
  }

  function settle(side: MagicTraySide) {
    const target = settleTarget(side)

    // A plain revert leaves the active snap point as it was set. Commit before
    // interpolating, which emits afterSnap right away when already in place.
    if (target !== state.snapped[side] || state.interpolateTo !== undefined) {
      state.snapped[side] = target
      state.activeSnapPoint[side] = snapPointAt(side, target)
    }

    interpolateDragged({ side, to: target })
  }

  function onPointermove(e: PointerEvent) {
    if (e.isTrusted && !e.isPrimary) {
      return
    }

    const side = state.draggingSide

    if (!side) {
      return
    }

    e.stopImmediatePropagation()
    e.stopPropagation()

    const coord = isVertical(side) ? e.clientY : e.clientX

    if (isSnapDrag(side)) {
      snapDragged(side, coord)
    } else {
      setDragged(side, coord)
      checkMomentum(side)
      checkPosition(side)
      emitWillSnapTo(side)
    }

    if (hasDragged.value) {
      lockSelectionOnce()
    }

    emitter.emit('drag', {
      id: toValue(id),
      side,
      value: state.dragged[side],
    })
  }

  function onPointerup(e: PointerEvent) {
    const side = state.draggingSide

    if (side) {
      if (isSnapDrag(side)) {
        releaseSnapDrag(side)
      } else {
        settle(side)
      }

      emitter.emit('afterDrag', {
        id: toValue(id),
        side,
        value: state.dragged[side],
      })
    }

    resetDragState()
    resetListeners()

    guardedReleasePointerCapture({ event: e, element: pointerdownTarget })
  }

  function onTouchmove(e: TouchEvent) {
    const side = state.draggingSide

    if (!side) {
      return
    }

    const firstTouch = e.touches[0]

    if (!firstTouch) {
      return
    }

    e.stopImmediatePropagation()
    e.stopPropagation()

    if (hasDragged.value) {
      e.preventDefault()
    }

    const coord = isVertical(side) ? firstTouch.clientY : firstTouch.clientX

    if (isSnapDrag(side)) {
      snapDragged(side, coord)
    } else {
      setDragged(side, coord)
      checkMomentum(side)
      checkPosition(side)
      emitWillSnapTo(side)
    }

    if (hasDragged.value) {
      lockSelectionOnce()
    }

    emitter.emit('drag', {
      id: toValue(id),
      side,
      value: state.dragged[side],
    })
  }

  function onTouchend() {
    const side = state.draggingSide

    if (side) {
      if (isSnapDrag(side)) {
        releaseSnapDrag(side)
      } else {
        settle(side)
      }

      emitter.emit('afterDrag', {
        id: toValue(id),
        side,
        value: state.dragged[side],
      })
    }

    resetDragState()
    resetListeners()
  }

  function beginDrag(
    side: MagicTraySide,
    coord: number,
    target: Element | null
  ) {
    active.value = true
    state.dragging = true
    state.draggingSide = side
    state.interpolateTo = undefined

    // Fold the magnetic preview into the committed inset so the grab is seamless
    state.dragged[side] += state.magnetic[side]
    state.magnetic[side] = 0
    state.lastDragged[side] = state.dragged[side]
    lastPendingTarget = undefined
    heldRangeSnap = false
    flicked = false
    pointerdownTarget = target

    if (selectionLock === 'press') {
      lockSelectionOnce()
    }

    switch (side) {
      case 'top':
      case 'left':
        state.origin = coord - state.dragged[side]
        break
      case 'bottom':
      case 'right':
        state.origin = coord + state.dragged[side]
        break
    }

    state.dragStart = new Date()

    emitter.emit('beforeDrag', {
      id: toValue(id),
      side,
      value: state.dragged[side],
    })
  }

  // End a drag cut short by the tray disabling or this scope ending, so the
  // side returns to its last snap point instead of resting mid-way
  function onCancel() {
    const side = state.draggingSide

    if (active.value && side) {
      interpolateDragged({ side, to: state.snapped[side] })
      resetDragState()
    }

    resetListeners()
  }

  // Public functions
  function onPointerdown(side: MagicTraySide, e: PointerEvent) {
    if (!canBegin(side)) {
      return
    }

    const coord = isVertical(side) ? e.clientY : e.clientX
    const target = e.target instanceof Element ? e.target : null
    beginDrag(side, coord, target)
    guardedSetPointerCapture({ event: e, element: target })

    resetListeners()
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
      {
        passive: false,
      }
    )

    cancelTouchend =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchend', onTouchend)
        : undefined
    cancelTouchcancel =
      isIOS() || isAndroid()
        ? useEventListener(document, 'touchcancel', onTouchend)
        : undefined

    onPointermove(e)
  }

  function onTouchstart(side: MagicTraySide, e: TouchEvent) {
    // On iOS the drag already runs on pointer events; canceling touchstart
    // keeps WebKit’s edge navigation swipe from hijacking a drag that starts
    // near the viewport edge
    if (toValue(preventEdgeNavigation)) {
      cancelEdgeNavigation({ event: e })
    }

    if (!isAndroid() || !canBegin(side)) {
      return
    }

    const firstTouch = e.touches[0]

    if (!firstTouch) {
      return
    }

    e.stopImmediatePropagation()
    e.stopPropagation()

    const coord = isVertical(side) ? firstTouch.clientY : firstTouch.clientX
    beginDrag(side, coord, e.target instanceof Element ? e.target : null)

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

    onTouchmove(e)
  }

  // If disabled while dragging, snap back to the last snap point
  watch(disabled, (value) => {
    if (value) {
      onCancel()
    }
  })

  onScopeDispose(onCancel, true)

  return {
    active: readonly(active),
    hasDragged,
    onPointerdown,
    onTouchstart,
  }
}

export type UseTrayGestureReturn = ReturnType<typeof useTrayGesture>
