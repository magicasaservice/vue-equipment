import {
  computed,
  watch,
  toValue,
  onScopeDispose,
  type Ref,
  type MaybeRef,
} from 'vue'
import { unrefElement, useEventListener, useRafFn } from '@vueuse/core'
import { clampValue } from '@maas/vue-equipment/utils'
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
  state: TrayState
}

type MagneticPoint = { inset: number; direction: TrayMagneticDirection }

const SIDES: TraySide[] = ['top', 'right', 'bottom', 'left']
const EPSILON = 0.5

export function useTrayMagnetism(args: UseTrayMagnetismArgs) {
  const { id, elRef, state } = args

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

  // A side's snap-point-to-direction record, or undefined if it is not magnetic
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

  // Resting insets at which each side is magnetic, paired with their direction.
  // Cached here so the per-frame loop only re-resolves it when the config or the
  // element rect changes, not on every pointer move.
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

  // Whether the pull has actually engaged since the side armed. Lets the latch
  // tell an approach still heading in (keep armed through the cap corridor) from
  // a finished gesture (drop the latch on exit, so a stale arm never re-triggers
  // a later cross-axis or outside approach).
  const engaged: Record<TraySide, boolean> = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  // The direction a side is armed from, or null while unarmed — a side only
  // pulls while armed. It arms once the cursor is deeper than the zone on an
  // approach its snap point allows, so the pull is only triggered by moving
  // toward the edge, not by crossing in from a cross axis. The direction also
  // signs the pull toward that approach. Grabbing a side disarms it, so it never
  // re-grabs right after a drag release.
  const armedDir: Record<TraySide, 'inner' | 'outer' | null> = {
    top: null,
    right: null,
    bottom: null,
    left: null,
  }

  // Last emitted progress per side, to only emit the magnetism event on change
  const progress: Record<TraySide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
  // A record key is a snap point stringified — coerce it back to its input type
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

  function resetSide(side: TraySide) {
    if (state.magnetic[side] !== 0) {
      state.magnetic[side] = 0
    }
  }

  function resetAll() {
    for (const side of SIDES) {
      resetSide(side)
    }
  }

  // How far a coordinate runs past a range, 0 while inside it
  function axisOverflow(value: number, min: number, max: number) {
    if (value < min) {
      return min - value
    }
    if (value > max) {
      return value - max
    }
    return 0
  }

  // Pull the resting edge toward the cursor as it approaches the handle
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

    const { radius, pull } = magnetism.value

    // A non-positive radius has no zone to ease across and would divide by zero
    if (radius <= 0) {
      resetAll()
      return
    }

    const rect = el.getBoundingClientRect()

    for (const side of magneticSides.value) {
      // Only pull while resting at a magnetic snap point — its config decides
      // which approach (inner, outer, or both) is allowed to arm the side.
      const direction = restDirection(side)
      if (!direction) {
        armedDir[side] = null
        engaged[side] = false
        resetSide(side)
        continue
      }
      const allowInner = direction === 'inner' || direction === 'both'
      const allowOuter = direction === 'outer' || direction === 'both'

      // Perpendicular distance to the resting edge (positive on the inner side)
      // and how far the cursor runs past the edge's span on the parallel axis.
      // Together they form a capsule-shaped zone — a band along the edge with
      // rounded caps — so rounding a corner eases in smoothly instead of jumping.
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

      // Depth on the perpendicular axis arms the side. Requiring real depth here
      // (not merely being in range) means the pull can only be initiated by
      // moving in toward the edge, never straight down a full cross axis — that
      // never reaches a deep perpendicular distance first. A side only arms from
      // a direction its snap point allows, so an outer-only point ignores an
      // inner approach and vice versa.
      if (perp > radius) {
        armedDir[side] = allowInner ? 'inner' : null
        engaged[side] = false
        resetSide(side)
        continue
      }

      if (perp < -radius) {
        armedDir[side] = allowOuter ? 'outer' : null
        engaged[side] = false
        resetSide(side)
        continue
      }

      // Distance to the edge across the capsule zone (band plus rounded caps)
      const gap = Math.hypot(perp, overflow)
      if (gap > radius) {
        // Once a pull has engaged, leaving the capsule ends the gesture and
        // disarms — a new pull needs a fresh deep approach. While only
        // approaching (not yet engaged) the latch is kept, so a diagonal that
        // briefly skirts the cap still pulls on arrival.
        if (engaged[side]) {
          armedDir[side] = null
          engaged[side] = false
        }
        resetSide(side)
        continue
      }

      // In the zone: pull only while armed
      if (!armedDir[side]) {
        resetSide(side)
        continue
      }

      // Shape the displacement across the radius with the easing: an ease-in
      // curve stays soft as the cursor enters the zone, then keeps gaining
      // toward the handle so the pull never goes stagnant near the edge. An
      // outer approach pulls the edge back out toward the cursor, so its offset
      // is negative; the clip path clamps it at the open position.
      const eased = easing.value((radius - gap) / radius)
      const magnitude = pull * eased
      const offset = armedDir[side] === 'outer' ? -magnitude : magnitude

      // Keep the previewed edge within the side's travel: it can pull out to the
      // open position (dragged + offset >= 0) and in to its max inset at most.
      state.magnetic[side] = clampValue(
        offset,
        -state.dragged[side],
        maxInset(side) - state.dragged[side]
      )
      engaged[side] = true
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

  watch(
    () => state.draggingSide,
    (side) => {
      if (side && enabled.value) {
        armedDir[side] = null
        engaged[side] = false
      }
    }
  )

  // Mirror the magnetic offset as a signed 0..1 progress (fraction of pull,
  // positive inward, negative outward) so handle-slot content can react, e.g.
  // a parallax. Emitted per side on change, alongside the drag progress event.
  watch(
    () => ({ ...state.magnetic }),
    (magnetic) => {
      const { pull } = magnetism.value
      for (const side of SIDES) {
        const value = pull > 0 ? clampValue(magnetic[side] / pull, -1, 1) : 0
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
