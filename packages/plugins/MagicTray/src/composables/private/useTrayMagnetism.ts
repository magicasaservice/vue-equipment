import {
  computed,
  reactive,
  watch,
  toValue,
  onScopeDispose,
  type Ref,
  type ShallowRef,
  type MaybeRef,
  type ComponentPublicInstance,
} from 'vue'
import { unrefElement, useEventListener, useRafFn } from '@vueuse/core'
import { clampValue, interpolate } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useEasings } from '@maas/vue-equipment/composables/useEasings'
import { useTraySnap } from './useTraySnap'

import type {
  TrayState,
  MagicTraySide,
  MagicTraySnapPoint,
  TrayMagneticSide,
  TrayMagneticRadius,
  TrayMagneticDirection,
} from '../../types'

type UseTrayMagnetismArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  // v-for stores each handle ref as a one-element array
  handleRefs: Record<
    MagicTraySide,
    Readonly<ShallowRef<ComponentPublicInstance[] | null>>
  >
  state: TrayState
}

type MagneticPoint = { inset: number; direction: TrayMagneticDirection }

// The scrub band normalized from `magnetism.radius`; ends undefined when unset
type RadiusBand = {
  start: number | undefined
  stop: number | undefined
  configured: boolean
}

const SIDES: MagicTraySide[] = ['top', 'right', 'bottom', 'left']
const EPSILON = 0.5

export function useTrayMagnetism(args: UseTrayMagnetismArgs) {
  const { id, elRef, handleRefs, state } = args

  const { throwError } = useMagicError({
    prefix: 'MagicTray',
    source: 'useTrayMagnetism',
  })

  const { mapSnapPoint, mappedSnapPoints, maxInset } = useTraySnap({
    id,
    state,
  })

  const emitter = useMagicEmitter()

  // Private state
  const easings = useEasings()
  const magnetism = computed(() => state.options.magnetism)
  const easing = computed(() => easings[magnetism.value.easing])
  const disabled = computed(() => state.options.disabled)
  const animation = computed(() => state.options.animation)
  const isVirtual = computed(() => magnetism.value.virtual)

  // Tracks the computed pull offset per side. Always written on every frame;
  // in virtual mode state.magnetic is left at zero so clipPath and handle
  // transforms are untouched, but the values here still drive magnet events.
  const magneticOffset = reactive<Record<MagicTraySide, number>>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  // Enabled, draggable sides that configure at least one magnetic snap point
  const magneticSides = computed<MagicTraySide[]>(() => {
    return SIDES.filter((side) => {
      const draggable = (state.options.snapPoints[side]?.length ?? 0) > 0
      const config = sideConfig(side)
      return draggable && !!config && Object.keys(config).length > 0
    })
  })

  // While false, nothing is attached and no per-frame math runs
  const enabled = computed(
    () => magneticSides.value.length > 0 && !disabled.value
  )

  // Resting insets at which each side is magnetic, with their direction. Cached
  // so the per-frame loop doesn’t re-resolve it on every pointer move.
  const magneticPoints = computed<Record<MagicTraySide, MagneticPoint[]>>(() => {
    const result: Record<MagicTraySide, MagneticPoint[]> = {
      top: [],
      right: [],
      bottom: [],
      left: [],
    }
    for (const side of magneticSides.value) {
      const config = sideConfig(side)
      if (!config || !mappedSnapPoints(side).length) {
        continue
      }
      result[side] = Object.entries(config)
        .map(([key, direction]) => ({
          inset: mapSnapPoint(side, coercePoint(key)),
          direction: direction as TrayMagneticDirection,
        }))
        .filter(
          (point): point is MagneticPoint =>
            point.inset === 0 || (!!point.inset && !Number.isNaN(point.inset))
        )
    }
    return result
  })

  // Last emitted progress per side, to only emit the magnetism event on change
  const progress: Record<MagicTraySide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  // The effective max pull per side, kept to normalize the magnet progress
  const pullPx: Record<MagicTraySide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  // The approach a side is armed from (signs the pull), or null while idle. A side
  // only pulls once the cursor has staged past the handle on the approach side.
  const armedDir: Record<MagicTraySide, 'inner' | 'outer' | null> = {
    top: null,
    right: null,
    bottom: null,
    left: null,
  }

  // Whether a side’s pull has reached max and is holding. Only a latched pull
  // survives the cursor leaving the handle’s span; an unlatched one drops.
  const latched: Record<MagicTraySide, boolean> = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  // The in-flight settle tween per side, easing a collapsing pull back to rest
  const settleId: Record<MagicTraySide, number | undefined> = {
    top: undefined,
    right: undefined,
    bottom: undefined,
    left: undefined,
  }
  const settling: Record<MagicTraySide, boolean> = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  // Coalesce moves to one update per frame to avoid layout thrash
  const { resume, pause } = useRafFn(
    () => {
      pause()
      update(lastX, lastY)
    },
    { immediate: false }
  )
  let lastX = 0
  let lastY = 0
  let cancelPointermove: (() => void) | undefined = undefined

  // Private functions
  // A side’s snap-point-to-direction record, or undefined if it’s not magnetic
  function sideConfig(side: MagicTraySide): TrayMagneticSide | undefined {
    const { sides } = magnetism.value
    return sides ? sides[side] : undefined
  }

  // A record key is a stringified snap point; coerce it back to its input type
  function coercePoint(key: string): MagicTraySnapPoint {
    return key.endsWith('px') ? (key as `${number}px`) : Number(key)
  }

  // Per-side magnetic snap points must each exist in that side’s snapPoints
  function validateSnapPoints() {
    for (const side of SIDES) {
      const config = sideConfig(side)

      if (!config) {
        continue
      }

      const configured = state.options.snapPoints[side] ?? []

      for (const key of Object.keys(config)) {
        if (!configured.includes(coercePoint(key))) {
          throwError({
            message:
              `magnetism.sides.${side} references snap point "${key}", ` +
              `which is not configured in snapPoints.${side}`,
            errorCode: 'invalid_magnetic_snap_point',
          })
        }
      }
    }
  }

  // The active direction(s) for a side at its current rest, or null if it is
  // not resting at a magnetic snap point
  function restDirection(side: MagicTraySide): TrayMagneticDirection | null {
    const rest = state.snapped[side]
    const match = magneticPoints.value[side].find(
      (point) => Math.abs(point.inset - rest) < EPSILON
    )

    return match ? match.direction : null
  }

  // The handle’s bounding rect, or null if no handle is mounted for the side.
  // v-for stores each ref as a one-element array; unwrap it to the handle.
  function handleRect(side: MagicTraySide): DOMRect | null {
    const handle = unrefElement(handleRefs[side].value?.[0])

    return handle ? handle.getBoundingClientRect() : null
  }

  function cancelSettle(side: MagicTraySide) {
    if (settleId[side] !== undefined) {
      cancelAnimationFrame(settleId[side])
      settleId[side] = undefined
    }
    settling[side] = false
  }

  function resetSide(side: MagicTraySide) {
    cancelSettle(side)
    magneticOffset[side] = 0
    if (!isVirtual.value && state.magnetic[side] !== 0) {
      state.magnetic[side] = 0
    }
  }

  // Drop a side’s arming and latch, and clear its pull instantly
  function disarm(side: MagicTraySide) {
    armedDir[side] = null
    latched[side] = false
    resetSide(side)
  }

  // Ease a collapsing pull home with the snap animation instead of dropping it.
  // Runs on its own rAF, so it finishes after the cursor stops; a live pull cancels it.
  function settleSide(side: MagicTraySide) {
    if (settling[side]) {
      return
    }

    if (Math.abs(magneticOffset[side]) <= EPSILON) {
      resetSide(side)
      return
    }

    const { duration, easing: snapEasing } = animation.value.snap

    settling[side] = true
    settleId[side] = interpolate({
      from: magneticOffset[side],
      to: 0,
      duration,
      easing: snapEasing,
      interpolationIdCallback: (newId) => (settleId[side] = newId),
      callback: (value) => {
        magneticOffset[side] = value
        if (!isVirtual.value) {
          state.magnetic[side] = value
        }
        if (value === 0) {
          settling[side] = false
          settleId[side] = undefined
        }
      },
    })
  }

  function resetAll() {
    for (const side of SIDES) {
      disarm(side)
    }
  }

  // How far a coordinate runs past a range, 0 while inside it
  function axisOverflow(value: number, min: number, max: number) {
    switch (true) {
      case value < min:
        return min - value
      case value > max:
        return value - max
      default:
        return 0
    }
  }

  // Normalize the configured radius into a { start, stop } band (px from the resting
  // edge). A bare number is the deprecated form (stop 0); both ends stay undefined
  // when nothing is set, so the band derives from the handle.
  function normalizeRadius(radius: TrayMagneticRadius): RadiusBand {
    if (typeof radius === 'number') {
      return radius > 0
        ? { start: radius, stop: 0, configured: true }
        : { start: undefined, stop: undefined, configured: false }
    }

    const { start, stop } = radius

    return { start, stop, configured: start !== undefined || stop !== undefined }
  }

  // Resolve the cursor against a side’s resting edge: `perp` (signed distance,
  // positive inner), `overflow` (how far past the edge’s parallel span), and `center`
  // (the handle’s rest offset, its live pull removed so the anchor doesn’t chase it).
  function measureAxis(
    side: MagicTraySide,
    x: number,
    y: number,
    rect: DOMRect,
    hRect: DOMRect | null
  ): { perp: number; overflow: number; center: number } {
    let perp = 0
    let overflow = 0
    let center = 0

    switch (side) {
      case 'top': {
        const edge = rect.top + state.snapped.top
        perp = y - edge
        overflow = axisOverflow(x, rect.left, rect.right)
        if (hRect) {
          center = hRect.top + hRect.height / 2 - edge - state.magnetic.top
        }
        break
      }

      case 'bottom': {
        const edge = rect.bottom - state.snapped.bottom
        perp = edge - y
        overflow = axisOverflow(x, rect.left, rect.right)
        if (hRect) {
          center = edge - (hRect.top + hRect.height / 2) - state.magnetic.bottom
        }
        break
      }

      case 'left': {
        const edge = rect.left + state.snapped.left
        perp = x - edge
        overflow = axisOverflow(y, rect.top, rect.bottom)
        if (hRect) {
          center = hRect.left + hRect.width / 2 - edge - state.magnetic.left
        }
        break
      }

      case 'right': {
        const edge = rect.right - state.snapped.right
        perp = edge - x
        overflow = axisOverflow(y, rect.top, rect.bottom)
        if (hRect) {
          center = edge - (hRect.left + hRect.width / 2) - state.magnetic.right
        }
        break
      }
    }

    return { perp, overflow, center }
  }

  // The scrub band as distances from the resting edge. A configured radius hangs it
  // off the clipped edge (handle size/offset can’t move it): `start` engages (t = 0),
  // `stop` tops out and latches (t = 1, defaults to `pull` so the edge meets the
  // cursor). Otherwise it derives from the handle’s near edge.
  function resolveBand(
    band: RadiusBand,
    geo: { pull: number; thickness: number; center: number }
  ): { innerEdge: number; outerEdge: number; span: number } {
    const { pull, thickness, center } = geo

    if (band.configured) {
      const stop = band.stop ?? pull
      const start = band.start ?? stop + (thickness || pull)

      return { innerEdge: start, outerEdge: -start, span: start - stop }
    }

    const anchorHalf = thickness / 2

    return {
      innerEdge: center + anchorHalf,
      outerEdge: center - anchorHalf,
      span: anchorHalf / 2,
    }
  }

  // Process one side for the frame: measure geometry, arm and scrub, then write the
  // pull (or ease a collapse home).
  function updateSide(
    side: MagicTraySide,
    x: number,
    y: number,
    rect: DOMRect,
    band: RadiusBand
  ) {
    // Only pull while resting at a magnetic snap point; its config sets the approach.
    const direction = restDirection(side)

    if (!direction) {
      disarm(side)
      return
    }

    const allowInner = direction === 'inner' || direction === 'both'
    const allowOuter = direction === 'outer' || direction === 'both'

    // Measure the handle; pull defaults to a quarter of its thickness.
    const hRect = handleRect(side)
    const thickness = hRect
      ? side === 'top' || side === 'bottom'
        ? hRect.height
        : hRect.width
      : 0
    const pull = magnetism.value.pull > 0 ? magnetism.value.pull : thickness / 4
    pullPx[side] = pull

    if (pull <= 0) {
      disarm(side)
      return
    }

    const { perp, overflow, center } = measureAxis(side, x, y, rect, hRect)
    const { innerEdge, outerEdge, span } = resolveBand(band, {
      pull,
      thickness,
      center,
    })

    if (span <= 0) {
      disarm(side)
      return
    }

    // Arm only while over the handle’s span, on an allowed approach. The span gate
    // keeps the pull from firing anywhere along the edge’s line.
    if (overflow === 0) {
      switch (true) {
        case allowInner && perp >= innerEdge:
          armedDir[side] = 'inner'
          break
        case allowOuter && perp <= outerEdge:
          armedDir[side] = 'outer'
          break
      }
    }

    const dir = armedDir[side]

    if (!dir) {
      resetSide(side)
      return
    }

    // Scrub: t runs 0→1 from `start` toward `stop`, easing the pull to its max where
    // it latches.
    let t = 0
    let sign = 0
    switch (dir) {
      case 'inner':
        t = clampValue((innerEdge - perp) / span, 0, 1)
        sign = 1
        break
      case 'outer':
        t = clampValue((perp - outerEdge) / span, 0, 1)
        sign = -1
        break
    }

    // Reaching `stop` latches the max; the latch only updates over the span. Off the
    // span a latched hold survives, a partial scrub drops and cancels.
    switch (true) {
      case overflow === 0:
        latched[side] = t >= 1
        break
      case !latched[side]:
        armedDir[side] = null
        resetSide(side)
        return
    }

    const magnitude = overflow === 0 ? easing.value(t) : 1
    const offset = sign * pull * magnitude

    // Clamp to the side’s travel, then write a live pull or ease a collapse home.
    const target = clampValue(
      offset,
      -state.dragged[side],
      maxInset(side) - state.dragged[side]
    )
    if (Math.abs(target) > EPSILON) {
      cancelSettle(side)
      magneticOffset[side] = target
      if (!isVirtual.value) {
        state.magnetic[side] = target
      }
    } else {
      settleSide(side)
    }
  }

  // Pull each resting edge toward the cursor as it scrubs across its handle
  function update(x: number, y: number) {
    if (state.dragging || disabled.value) {
      resetAll()
      return
    }

    const el = unrefElement(elRef)

    if (!el) {
      resetAll()
      return
    }

    const band = normalizeRadius(magnetism.value.radius)
    const rect = el.getBoundingClientRect()

    for (const side of magneticSides.value) {
      updateSide(side, x, y, rect, band)
    }
  }

  function onPointermove(e: PointerEvent) {
    lastX = e.clientX
    lastY = e.clientY
    resume()
  }

  function attach() {
    cancelPointermove = useEventListener(
      document,
      'pointermove',
      onPointermove,
      { passive: true }
    )
  }

  function detach() {
    cancelPointermove?.()
    cancelPointermove = undefined
    pause()
    resetAll()
  }

  // Mirror the magnetic offset as a signed 0..1 progress (fraction of pull,
  // positive inward) so handle-slot content can react. Emitted per side on change.
  // Watches magneticOffset so events fire in both normal and virtual mode.
  watch(
    () => ({ ...magneticOffset }),
    (magnetic) => {
      for (const side of SIDES) {
        const max = pullPx[side]
        const value = max > 0 ? clampValue(magnetic[side] / max, -1, 1) : 0
        if (value !== progress[side]) {
          progress[side] = value
          emitter.emit('magnet', {
            id: toValue(id),
            side,
            value,
          })
        }
      }
    },
    { deep: true }
  )

  // A snap moves the rest position without a pointer move, so the loop never runs
  // to clear a live preview. Release the pull and ease the offset home in step.
  watch(
    () => ({ ...state.snapped }),
    (next, prev) => {
      for (const side of SIDES) {
        if (next[side] !== prev[side]) {
          armedDir[side] = null
          latched[side] = false
          settleSide(side)
        }
      }
    }
  )

  // Shallow watch is enough since options are replaced wholesale, no deep traversal
  watch(
    () => [enabled.value, magnetism.value.sides, state.options.snapPoints],
    () => {
      if (enabled.value) {
        validateSnapPoints()
      }
    },
    { immediate: true }
  )

  watch(enabled, (active) => (active ? attach() : detach()), {
    immediate: true,
  })

  onScopeDispose(() => {
    detach()
  })

  return {}
}
