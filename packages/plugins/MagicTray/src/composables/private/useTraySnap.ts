import { computed, nextTick, toValue } from 'vue'
import {
  clampValue,
  interpolate,
  snapRangeAt,
  snapTargetAt,
} from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useTrayUtils } from './useTrayUtils'

import type { MaybeRef } from 'vue'

import type {
  MagicTraySide,
  MagicTraySnapPoint,
  MagicTraySnapRange,
  TrayState,
} from '../../types'

type UseTraySnapArgs = {
  id: MaybeRef<string>
  state: TrayState
}

type SnapToArgs = {
  side: MagicTraySide
  snapPoint: MagicTraySnapPoint
  interpolate: boolean
  duration?: number
}

type InterpolateDraggedArgs = {
  side: MagicTraySide
  to: number
  duration?: number
  easing?: (t: number) => number
}

type MappedSnapRange = {
  min: number
  max: number
  range: MagicTraySnapRange
}

// How close a pixel inset has to be to a snap point to count as it
const SNAP_TOLERANCE = 0.01

function isMapped(value: number | undefined): value is number {
  return value !== undefined && !Number.isNaN(value)
}

function roundDecimal(value: number) {
  return Math.round(value * 10000) / 10000
}

export function useTraySnap(args: UseTraySnapArgs) {
  const { id, state } = args
  const { isVertical, oppositeSide, isSnapRange, flattenSnapPoints } =
    useTrayUtils()
  const emitter = useMagicEmitter()

  const snapPoints = computed(() => state.options.snapPoints)
  const animation = computed(() => state.options.animation)

  // The full extent a side can be inset by, based on the element rect
  function dimension(side: MagicTraySide) {
    const rect = state.elRect
    if (!rect) {
      return 0
    }
    return isVertical(side) ? rect.height : rect.width
  }

  // The maximum inset a side can take without crossing the opposite side
  function maxInset(side: MagicTraySide) {
    return Math.max(0, dimension(side) - state.dragged[oppositeSide(side)])
  }

  // Reserved outer overshoot for a side (0 if the side is not draggable)
  function padding(side: MagicTraySide) {
    return state.overshoot.outer[side]
  }

  // Content extent along a side's axis, minus the outer overshoot on both ends
  function contentExtent(side: MagicTraySide) {
    return Math.max(
      0,
      dimension(side) - padding(side) - padding(oppositeSide(side))
    )
  }

  // Map a snap point (percentage or pixel) to a pixel inset, offset by the padding
  function mapSnapPoint(side: MagicTraySide, snapPoint: MagicTraySnapPoint) {
    const extent = contentExtent(side)
    if (!extent) {
      return undefined
    }

    if (typeof snapPoint === 'number') {
      // Percentage of the content, 0 = open (flush), 1 = fully clipped
      return padding(side) + clampValue(snapPoint, 0, 1) * extent
    } else {
      const parsed = parseFloat(snapPoint)

      if (Number.isNaN(parsed)) {
        return undefined
      }

      return padding(side) + clampValue(parsed, 0, extent)
    }
  }

  // Snap points and range ends mapped to pixels, deduplicated and sorted
  function mappedSnapPoints(side: MagicTraySide) {
    const configured = flattenSnapPoints(snapPoints.value[side] ?? [])

    const mapped = configured
      .map((snapPoint) => mapSnapPoint(side, snapPoint))
      .filter(isMapped)

    return [...new Set(mapped)].sort((a, b) => a - b)
  }

  // Map a pixel inset back to its original snap point input, for events
  function snapPointsMap(side: MagicTraySide) {
    const configured = flattenSnapPoints(snapPoints.value[side] ?? [])
    const map: Record<number, MagicTraySnapPoint> = {}

    for (const snapPoint of configured) {
      const mapped = mapSnapPoint(side, snapPoint)
      if (isMapped(mapped)) {
        map[mapped] = snapPoint
      }
    }

    return map
  }

  // Configured ranges mapped to pixels, ends ordered
  function mappedRanges(side: MagicTraySide): Array<MappedSnapRange> {
    const configured = snapPoints.value[side] ?? []

    return configured.filter(isSnapRange).flatMap((range) => {
      const min = mapSnapPoint(side, range.min)
      const max = mapSnapPoint(side, range.max)

      if (!isMapped(min) || !isMapped(max)) {
        return []
      }

      return [{ min: Math.min(min, max), max: Math.max(min, max), range }]
    })
  }

  // The range a pixel inset lies within, ends included
  function rangeAt(side: MagicTraySide, inset: number) {
    return snapRangeAt({ ranges: mappedRanges(side), position: inset })
  }

  // The snap point a pixel inset resolves to: a configured point, or a value
  // inside a range, rounded to four decimals when both of its ends are
  // decimals and to whole pixels otherwise
  function snapPointAt(
    side: MagicTraySide,
    inset: number
  ): MagicTraySnapPoint | undefined {
    const configured = snapPointsMap(side)[inset]

    if (configured !== undefined) {
      return configured
    }

    const mapped = rangeAt(side, inset)

    if (!mapped) {
      return undefined
    }

    const offset = inset - padding(side)
    const { min, max } = mapped.range

    return typeof min === 'number' && typeof max === 'number'
      ? roundDecimal(offset / contentExtent(side))
      : `${Math.round(offset)}px`
  }

  // The inset a value inside a range rests at, so it matches the rounded
  // snap point it reports
  function restingInset(side: MagicTraySide, inset: number) {
    const range = rangeAt(side, inset)
    const snapPoint = snapPointAt(side, inset)

    if (!range || snapPoint === undefined) {
      return inset
    }

    const mapped = mapSnapPoint(side, snapPoint)

    return mapped === undefined
      ? inset
      : clampValue(mapped, range.min, range.max)
  }

  // Whether a snap point maps onto a configured point or into a range
  function isSnapTarget(side: MagicTraySide, snapPoint: MagicTraySnapPoint) {
    const mapped = mapSnapPoint(side, snapPoint)

    if (mapped === undefined) {
      return false
    }

    return (
      !!rangeAt(side, mapped) ||
      mappedSnapPoints(side).some(
        (point) => Math.abs(point - mapped) < SNAP_TOLERANCE
      )
    )
  }

  // Where a pixel inset lands without a drag: in place inside a range,
  // otherwise at the closest snap point
  function findSnapTarget(side: MagicTraySide, inset: number) {
    const target = snapTargetAt({
      points: mappedSnapPoints(side),
      ranges: mappedRanges(side),
      value: inset,
    })

    return target === undefined ? undefined : restingInset(side, target)
  }

  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      side,
      to,
      duration = toValue(animation).snap.duration,
      easing = toValue(animation).snap.easing,
    } = args

    const snapPoint = snapPointAt(side, to)

    if (snapPoint === undefined) {
      // Still animate, but without snap events for unmapped values
      interpolate({
        from: state.dragged[side],
        to,
        duration,
        easing,
        callback: (value: number) => {
          state.dragged[side] = value
        },
      })
      return
    }

    emitter.emit('beforeSnap', {
      id: toValue(id),
      snapPoint: { side, point: snapPoint },
    })

    // Already in place, as after a release inside a range; animating from
    // and to the same value would emit afterSnap on every frame
    if (state.dragged[side] === to) {
      emitter.emit('afterSnap', {
        id: toValue(id),
        snapPoint: { side, point: snapPoint },
      })
      return
    }

    interpolate({
      from: state.dragged[side],
      to,
      duration,
      easing,
      callback: (value: number) => {
        state.dragged[side] = value
        if (state.dragged[side] === to) {
          emitter.emit('afterSnap', {
            id: toValue(id),
            snapPoint: { side, point: snapPoint },
          })
        }
      },
    })
  }

  async function snapTo(args: SnapToArgs) {
    const { side, snapPoint, interpolate: shouldInterpolate, duration } = args
    await nextTick()

    const mapped = mapSnapPoint(side, snapPoint)

    if (mapped === undefined) {
      return
    }

    const closest = findSnapTarget(side, mapped) ?? mapped

    // Commit first, as an interpolation that is already in place emits afterSnap
    // right away
    state.snapped[side] = closest
    state.activeSnapPoint[side] = snapPointAt(side, closest) ?? snapPoint

    if (shouldInterpolate) {
      interpolateDragged({ side, to: closest, duration })
    } else {
      state.dragged[side] = closest
    }
  }

  return {
    dimension,
    padding,
    contentExtent,
    maxInset,
    mapSnapPoint,
    mappedSnapPoints,
    mappedRanges,
    rangeAt,
    snapPointAt,
    restingInset,
    isSnapTarget,
    findSnapTarget,
    interpolateDragged,
    snapTo,
  }
}
