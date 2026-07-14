import {
  computed,
  onMounted,
  watch,
  toValue,
  nextTick,
  onScopeDispose,
  markRaw,
  type Ref,
  type MaybeRef,
} from 'vue'
import {
  useEventListener,
  unrefElement,
  useResizeObserver,
  useThrottleFn,
  type UseResizeObserverReturn,
} from '@vueuse/core'
import {
  convertToPixels,
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
import { useTraySnap } from './useTraySnap'
import { useTrayUtils } from './useTrayUtils'
import { useTrayState } from './useTrayState'

import type { MagicTraySide } from '../../types'

type UseTrayDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
}

const SIDES: MagicTraySide[] = ['top', 'right', 'bottom', 'left']

export function useTrayDrag(args: UseTrayDragArgs) {
  const { id, elRef } = args

  const { logWarning } = useMagicError({
    prefix: 'MagicTray',
    source: 'useTrayDrag',
  })

  const { initializeState } = useTrayState(toValue(id))
  const state = initializeState()

  const { clampWithOvershoot, isVertical } = useTrayUtils()
  const emitter = useMagicEmitter()

  const {
    dimension,
    maxInset,
    mapSnapPoint,
    mappedSnapPoints,
    snapPointsMap,
    findClosestSnapPoint,
    interpolateDragged,
    snapTo,
  } = useTraySnap({ id, state })

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

  // The original snap point input that opens a side, for snapTo
  function openSnapPoint(side: MagicTraySide) {
    const points = mappedSnapPoints(side)

    return points.length ? snapPointsMap(side)[points[0]!] : undefined
  }

  // The last emitted pending snap target — only emit willSnapTo on change
  let lastPendingTarget: number | undefined = undefined

  // Swallow the click a drag synthesises on release, so dragging a handle never
  // fires a slotted element’s click. A genuine tap leaves this false and passes
  // through untouched.
  let suppressClick = false

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelPointercancel: (() => void) | undefined = undefined
  let cancelTouchmove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined
  let cancelTouchcancel: (() => void) | undefined = undefined
  let resizeObserverEl: UseResizeObserverReturn | null = null
  let pointerdownTarget: HTMLElement | undefined = undefined

  // Sides that have at least one snap point are draggable
  const draggableSides = computed(() =>
    SIDES.filter((side) => (state.options.snapPoints[side]?.length ?? 0) > 0)
  )

  const threshold = computed(() => state.options.threshold)
  const disabled = computed(() => state.options.disabled)
  const snapMode = computed(() => state.options.snap.mode)
  const dragMode = computed(() => state.options.drag.mode)

  function snapReference(side: MagicTraySide) {
    return snapMode.value === 'step'
      ? state.lastDragged[side]
      : state.dragged[side]
  }

  function isSnapDrag(side: MagicTraySide) {
    return typeof dragMode.value === 'string'
      ? dragMode.value === 'snap'
      : (dragMode.value?.[side] ?? 'free') === 'snap'
  }

  const hasDragged = computed(() => {
    const side = state.draggingSide

    if (!side) {
      return false
    }

    return !isWithinRange({
      input: state.dragged[side],
      base: state.lastDragged[side],
      threshold: toValue(threshold).lock,
    })
  })

  // Clip-path from all four sides, negative insets clamped to keep it valid.
  // Each side and corner reads from an overridable variable: sides fall back to
  // the computed inset, corners to the shared --magic-tray-radius.
  const clipPath = computed(() => {
    const top = Math.max(0, state.dragged.top + state.magnetic.top)
    const right = Math.max(0, state.dragged.right + state.magnetic.right)
    const bottom = Math.max(0, state.dragged.bottom + state.magnetic.bottom)
    const left = Math.max(0, state.dragged.left + state.magnetic.left)

    return (
      `inset(` +
      `var(--magic-tray-clip-top, ${top}px) ` +
      `var(--magic-tray-clip-right, ${right}px) ` +
      `var(--magic-tray-clip-bottom, ${bottom}px) ` +
      `var(--magic-tray-clip-left, ${left}px) ` +
      `round ` +
      `var(--magic-tray-radius-top-left, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-top-right, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-bottom-right, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-bottom-left, var(--magic-tray-radius, 0px)))`
    )
  })

  // Position a handle at the inner edge of the clip. The resting inset rides on
  // the box offset, the magnetic preview on a transform variable, so the per-frame
  // pull moves it on the compositor without a relayout (which flickers in Chrome).
  function handleStyle(side: MagicTraySide) {
    const rest = `${state.dragged[side]}px`
    const magnetic = `${state.magnetic[side]}px`

    switch (side) {
      case 'top':
        return {
          top: rest,
          left: '0px',
          right: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'bottom':
        return {
          bottom: rest,
          left: '0px',
          right: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'left':
        return {
          left: rest,
          top: '0px',
          bottom: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'right':
        return {
          right: rest,
          top: '0px',
          bottom: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }
    }
  }

  async function getSizes() {
    const el = unrefElement(elRef)

    if (!el) {
      state.elRect = undefined
      return
    }

    // Retry across a few frames until the rect settles to a non-zero size
    let rect = el.getBoundingClientRect()
    let tries = 0
    while (rect.width === 0 && rect.height === 0 && tries < 5) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      rect = el.getBoundingClientRect()
      tries++
    }

    state.elRect = markRaw(rect)

    // Measure the reserved outer overshoot straight off the element padding
    const style = getComputedStyle(el)
    state.overshoot.outer = {
      top: parseFloat(style.paddingTop) || 0,
      right: parseFloat(style.paddingRight) || 0,
      bottom: parseFloat(style.paddingBottom) || 0,
      left: parseFloat(style.paddingLeft) || 0,
    }

    // Resolve the inner overshoot from its CSS variable into pixels
    const innerVar = style.getPropertyValue('--magic-tray-drag-overshoot-inner')
    const innerPixels = convertToPixels(innerVar)
    if (innerPixels === undefined) {
      logWarning(
        `--magic-tray-drag-overshoot-inner (${innerVar}) needs to be specified in px or rem`
      )
    }
    state.overshoot.inner = innerPixels ?? 0

    await nextTick()
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
  // instead of following it freely — a hard cut, no interpolation. Leaves
  // `lastDragged` untouched so `hasDragged` still reflects the gesture’s start,
  // which is what lets a genuine tap on the handle pass its click through.
  function snapDragged(side: MagicTraySide, coord: number) {
    const inset = computeInset(side, coord)
    const target = findClosestSnapPoint({ side, value: inset })

    if (target === undefined || target === state.snapped[side]) {
      return
    }

    const snapPoint = snapPointsMap(side)[target]

    state.dragged[side] = target
    state.snapped[side] = target
    state.activeSnapPoint[side] = snapPoint

    if (snapPoint || snapPoint === 0) {
      emitter.emit('beforeSnap', {
        id: toValue(id),
        snapPoint: { side, point: snapPoint },
      })
      emitter.emit('afterSnap', {
        id: toValue(id),
        snapPoint: { side, point: snapPoint },
      })
    }
  }

  function checkPosition(side: MagicTraySide) {
    const delta = state.dragged[side] - state.lastDragged[side]

    if (Math.abs(delta) > toValue(threshold).distance) {
      // Snap to the next point in the direction the edge was dragged
      state.interpolateTo = findClosestSnapPoint({
        side,
        value: snapReference(side),
        direction: delta < 0 ? 'below' : 'above',
      })
    } else {
      // Dragged back within the threshold — clear any committed target so the
      // tray reverts to its origin snap point on release
      state.interpolateTo = undefined
    }
  }

  function emitWillSnapTo(side: MagicTraySide) {
    const target = state.interpolateTo ?? state.snapped[side]
    if (target === lastPendingTarget) {
      return
    }
    lastPendingTarget = target

    const snapPoint = snapPointsMap(side)[target]
    if (!snapPoint && snapPoint !== 0) {
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

    if (velocity > toValue(threshold).momentum) {
      state.interpolateTo = findClosestSnapPoint({
        side,
        value: snapReference(side),
        direction: state.relDirection[side],
      })
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

  function resetDragState() {
    state.dragging = false
    state.draggingSide = undefined
    state.interpolateTo = undefined
  }

  function settle(side: MagicTraySide) {
    if (state.interpolateTo || state.interpolateTo === 0) {
      interpolateDragged({ side, to: state.interpolateTo })
      state.snapped[side] = state.interpolateTo
      state.activeSnapPoint[side] = snapPointsMap(side)[state.interpolateTo]
    } else {
      // Threshold not reached, animate back to the previous snap point
      interpolateDragged({ side, to: state.snapped[side] })
    }
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

    emitter.emit('drag', {
      id: toValue(id),
      side,
      value: state.dragged[side],
    })
  }

  function onPointerup(e: PointerEvent) {
    const side = state.draggingSide

    if (side) {
      // Read before resetDragState() clears draggingSide, or hasDragged would always be false
      suppressClick = hasDragged.value

      // Snap-drag sides are already resting on their committed point
      if (!isSnapDrag(side)) {
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

    emitter.emit('drag', {
      id: toValue(id),
      side,
      value: state.dragged[side],
    })
  }

  function onTouchend() {
    const side = state.draggingSide

    if (side) {
      // Read before resetDragState() clears draggingSide, or hasDragged would always be false
      suppressClick = hasDragged.value

      // Snap-drag sides are already resting on their committed point
      if (!isSnapDrag(side)) {
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

  function beginDrag(side: MagicTraySide, coord: number, target: HTMLElement) {
    state.dragging = true
    state.draggingSide = side
    state.interpolateTo = undefined

    // Fold the magnetic preview into the committed inset so the grab is seamless
    state.dragged[side] += state.magnetic[side]
    state.magnetic[side] = 0
    state.lastDragged[side] = state.dragged[side]
    lastPendingTarget = undefined
    suppressClick = false
    pointerdownTarget = target

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

  function onHandlePointerdown(side: MagicTraySide, e: PointerEvent) {
    if (state.dragging || toValue(disabled)) {
      return
    }

    const coord = isVertical(side) ? e.clientY : e.clientX
    const target = e.target as HTMLElement
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

  function onHandleTouchstart(side: MagicTraySide, e: TouchEvent) {
    if (!isAndroid() || state.dragging || toValue(disabled)) {
      return
    }

    const firstTouch = e.touches[0]

    if (!firstTouch) {
      return
    }

    e.stopImmediatePropagation()
    e.stopPropagation()

    const coord = isVertical(side) ? firstTouch.clientY : firstTouch.clientX
    beginDrag(side, coord, e.target as HTMLElement)

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

  // Runs in the capture phase, ahead of any slotted element, so a click a drag
  // synthesises on release never reaches it. A genuine tap passes through.
  function onHandleClick(e: MouseEvent) {
    if (suppressClick) {
      e.stopPropagation()
      e.preventDefault()
    }
    suppressClick = false
  }

  // Programmatic snapTo via emitter
  async function snapToCallback(payload: MagicEmitterEvents['snapTo']) {
    const { snapPoint } = payload

    if (
      payload.id !== toValue(id) ||
      typeof snapPoint !== 'object' ||
      Array.isArray(snapPoint)
    ) {
      return
    }

    const { side, point } = snapPoint

    if (!draggableSides.value.includes(side)) {
      logWarning(`Cannot snap side "${side}" without snap points`)
      return
    }

    // Ensure an up to date rect before mapping the snap point
    await getSizes()

    snapTo({
      side,
      snapPoint: point,
      interpolate: true,
      duration: payload.duration,
    })
  }

  // Apply the configured initial snap points, otherwise open each side.
  // With `transition`, seed the open extreme and interpolate in.
  async function applyInitial() {
    await getSizes()

    const { transition } = state.options.initial

    for (const side of draggableSides.value) {
      const initial =
        state.options.initial.snapPoints?.[side] ?? openSnapPoint(side)

      if (initial === undefined) {
        continue
      }

      if (transition) {
        const start = mapSnapPoint(side, 0)
        if (start !== undefined) {
          state.dragged[side] = start
        }
        await snapTo({ side, snapPoint: initial, interpolate: true })
      } else {
        await snapTo({ side, snapPoint: initial, interpolate: false })
      }
    }
  }

  // Warn when a draggable side can neither fully open nor has an initial point
  function validateSnapPoints() {
    for (const side of draggableSides.value) {
      const points = state.options.snapPoints[side] ?? []
      const canOpen = points.some((point) => parseFloat(String(point)) === 0)
      const hasInitial = state.options.initial.snapPoints?.[side] !== undefined

      if (!canOpen && !hasInitial) {
        logWarning(
          `Side “${side}” has no \`0\` snap point and no \`initial.snapPoints.${side}\`, ` +
            `so it rests at its smallest snap point instead of fully open. ` +
            `Add \`0\` to its snap points or set an initial snap point to make this explicit.`
        )
      }
    }
  }

  async function initialize() {
    validateSnapPoints()
    // Attach synchronously so an early programmatic snap is never missed
    emitter.on('snapTo', snapToCallback)
    await getSizes()
  }

  function destroy() {
    emitter.off('snapTo', snapToCallback)
    resizeObserverEl?.stop()
    resetDragState()
    resetListeners()
  }

  onMounted(async () => {
    await initialize()
  })

  // Re-validate when the snap point configuration changes at runtime
  watch(
    () => [state.options.snapPoints, state.options.initial.snapPoints],
    () => validateSnapPoints(),
    { deep: true }
  )

  watch(
    () => unrefElement(elRef),
    async () => {
      await applyInitial()
    }
  )

  // If disabled while dragging, snap back to the last snap point
  watch(disabled, (value) => {
    if (value && state.draggingSide) {
      const side = state.draggingSide
      interpolateDragged({ side, to: state.snapped[side] })
      resetDragState()
      resetListeners()
    }
  })

  // Keep insets correct on resize by re-snapping to the active points
  resizeObserverEl = useResizeObserver(elRef, () => {
    useThrottleFn(async () => {
      await getSizes()
      for (const side of draggableSides.value) {
        const active = state.activeSnapPoint[side]
        if (active !== undefined) {
          await snapTo({ side, snapPoint: active, interpolate: false })
        }
      }
    }, 100)()
  })

  onScopeDispose(() => {
    destroy()
  }, true)

  return {
    draggableSides,
    clipPath,
    handleStyle,
    hasDragged,
    dimension,
    onHandlePointerdown,
    onHandleTouchstart,
    onHandleClick,
  }
}
