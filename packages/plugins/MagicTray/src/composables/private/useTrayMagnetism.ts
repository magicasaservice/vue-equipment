import {
  computed,
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
  TraySide,
  TraySnapPoint,
  TrayMagneticSide,
  TrayMagneticDirection,
} from '../../types'

type UseTrayMagnetismArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  // v-for stores each handle ref as a one-element array
  handleRefs: Record<TraySide, Readonly<ShallowRef<ComponentPublicInstance[] | null>>>
  state: TrayState
}

type MagneticPoint = { inset: number; direction: TrayMagneticDirection }

const SIDES: TraySide[] = ['top', 'right', 'bottom', 'left']
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

  // A side’s snap-point-to-direction record, or undefined if it’s not magnetic
  function sideConfig(side: TraySide): TrayMagneticSide | undefined {
    const { sides } = magnetism.value
    return sides ? sides[side] : undefined
  }

  // Enabled, draggable sides that configure at least one magnetic snap point
  const magneticSides = computed<TraySide[]>(() => {
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
  const magneticPoints = computed<Record<TraySide, MagneticPoint[]>>(() => {
    const result: Record<TraySide, MagneticPoint[]> = {
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
  const progress: Record<TraySide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  // The effective max pull per side, kept to normalize the magnet progress
  const pullPx: Record<TraySide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  // The approach a side is armed from, or null while idle. A side only pulls once
  // the cursor has staged just past the handle on the approach side, then scrubs
  // in from there. The arm signs the pull; `latched` (below) tracks reaching max.
  const armedDir: Record<TraySide, 'inner' | 'outer' | null> = {
    top: null,
    right: null,
    bottom: null,
    left: null,
  }

  // Whether a side’s pull has reached max and is holding. Only a latched pull
  // survives the cursor leaving the handle’s span; an unlatched one drops.
  const latched: Record<TraySide, boolean> = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  // The in-flight settle tween per side, easing a collapsing pull back to rest
  const settleId: Record<TraySide, number | undefined> = {
    top: undefined,
    right: undefined,
    bottom: undefined,
    left: undefined,
  }
  const settling: Record<TraySide, boolean> = {
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
  // A record key is a stringified snap point; coerce it back to its input type
  function coercePoint(key: string): TraySnapPoint {
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
  function restDirection(side: TraySide): TrayMagneticDirection | null {
    const rest = state.snapped[side]
    const match = magneticPoints.value[side].find(
      (point) => Math.abs(point.inset - rest) < EPSILON
    )
    return match ? match.direction : null
  }

  // Half the handle’s perpendicular size (height for top/bottom, width for
  // left/right). The default for both the radius and the max pull, 0 if no handle.
  function handleHalfThickness(side: TraySide): number {
    // v-for stores each ref as a one-element array; unwrap it to the handle
    const handle = unrefElement(handleRefs[side].value?.[0])
    if (!handle) {
      return 0
    }
    const rect = handle.getBoundingClientRect()
    const size = side === 'top' || side === 'bottom' ? rect.height : rect.width
    return size / 2
  }

  function cancelSettle(side: TraySide) {
    if (settleId[side] !== undefined) {
      cancelAnimationFrame(settleId[side])
      settleId[side] = undefined
    }
    settling[side] = false
  }

  function resetSide(side: TraySide) {
    cancelSettle(side)
    if (state.magnetic[side] !== 0) {
      state.magnetic[side] = 0
    }
  }

  // Ease the edge back to rest instead of dropping it, reusing the snap animation,
  // so a collapsing pull (e.g. a `both` point flipping mid-cross) glides home. Runs
  // on its own rAF, so it finishes after the cursor stops; a live pull cancels it.
  function settleSide(side: TraySide) {
    if (settling[side]) {
      return
    }
    if (Math.abs(state.magnetic[side]) <= EPSILON) {
      resetSide(side)
      return
    }
    const { duration, easing: snapEasing } = animation.value.snap
    settling[side] = true
    settleId[side] = interpolate({
      from: state.magnetic[side],
      to: 0,
      duration,
      easing: snapEasing,
      interpolationIdCallback: (newId) => (settleId[side] = newId),
      callback: (value) => {
        state.magnetic[side] = value
        if (value === 0) {
          settling[side] = false
          settleId[side] = undefined
        }
      },
    })
  }

  function resetAll() {
    for (const side of SIDES) {
      armedDir[side] = null
      latched[side] = false
      resetSide(side)
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

  // Pull the resting edge toward the cursor as it scrubs across the handle
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

    // A configured radius or pull overrides the handle; 0 (the default) derives
    // both from the handle’s half-thickness below.
    const { pull: configuredPull, radius: configuredRadius } = magnetism.value

    const rect = el.getBoundingClientRect()

    for (const side of magneticSides.value) {
      // Only pull while resting at a magnetic snap point; its config sets which
      // approach (inner, outer, or both) the side reacts to.
      const direction = restDirection(side)
      if (!direction) {
        armedDir[side] = null
        latched[side] = false
        resetSide(side)
        continue
      }
      const allowInner = direction === 'inner' || direction === 'both'
      const allowOuter = direction === 'outer' || direction === 'both'

      // The handle straddles the resting edge, spanning ±anchorHalf. The zone is a
      // band of width `radius` at the handle’s approach-side edge, scrubbed inward.
      // Radius and pull default to a quarter of the handle thickness; either can be
      // set explicitly.
      const anchorHalf = handleHalfThickness(side)
      const radius = configuredRadius > 0 ? configuredRadius : anchorHalf / 2
      const pull = configuredPull > 0 ? configuredPull : anchorHalf / 2
      pullPx[side] = pull
      if (radius <= 0) {
        armedDir[side] = null
        latched[side] = false
        resetSide(side)
        continue
      }

      // Perpendicular distance to the resting edge (positive on the inner side)
      // and how far the cursor runs past the edge’s span on the parallel axis.
      let perp = 0
      let overflow = 0
      switch (side) {
        case 'top':
          perp = y - (rect.top + state.snapped.top)
          overflow = axisOverflow(x, rect.left, rect.right)
          break
        case 'bottom':
          perp = rect.bottom - state.snapped.bottom - y
          overflow = axisOverflow(x, rect.left, rect.right)
          break
        case 'left':
          perp = x - (rect.left + state.snapped.left)
          overflow = axisOverflow(y, rect.top, rect.bottom)
          break
        case 'right':
          perp = rect.right - state.snapped.right - x
          overflow = axisOverflow(y, rect.top, rect.bottom)
          break
      }

      // Arm only while the cursor is over the handle’s span, on an allowed approach
      // (inner edge from inside, outer from outside). The span gate keeps the pull
      // from triggering anywhere along the edge’s line, only over the handle.
      if (overflow === 0) {
        switch (true) {
          case allowInner && perp >= anchorHalf:
            armedDir[side] = 'inner'
            break
          case allowOuter && perp <= -anchorHalf:
            armedDir[side] = 'outer'
            break
        }
      }

      const dir = armedDir[side]
      if (!dir) {
        resetSide(side)
        continue
      }

      // Scrub: t runs 0→1 as the cursor crosses the band from the handle’s edge
      // (anchorHalf) toward the resting edge, easing the pull up to its max.
      let t = 0
      let sign = 0
      switch (dir) {
        case 'inner':
          t = clampValue((anchorHalf - perp) / radius, 0, 1)
          sign = 1
          break
        case 'outer':
          t = clampValue((anchorHalf + perp) / radius, 0, 1)
          sign = -1
          break
      }

      // Reaching the far end latches the pull at max. The latch only updates over
      // the span: a latched hold survives the cursor leaving the handle, a partial
      // scrub drops and cancels. Scrubbing back toward the edge runs it down.
      switch (true) {
        case overflow === 0:
          latched[side] = t >= 1
          break
        case !latched[side]:
          armedDir[side] = null
          resetSide(side)
          continue
      }

      const magnitude = overflow === 0 ? easing.value(t) : 1
      const offset = sign * pull * magnitude

      // Keep the previewed edge within the side’s travel: it can pull out to the
      // open position (dragged + offset >= 0) and in to its max inset at most.
      const target = clampValue(
        offset,
        -state.dragged[side],
        maxInset(side) - state.dragged[side]
      )

      // A live pull tracks the cursor; a target collapsed to rest eases home with
      // the snap animation instead of snapping.
      switch (true) {
        case Math.abs(target) > EPSILON:
          cancelSettle(side)
          state.magnetic[side] = target
          break
        default:
          settleSide(side)
      }
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
  watch(
    () => ({ ...state.magnetic }),
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
