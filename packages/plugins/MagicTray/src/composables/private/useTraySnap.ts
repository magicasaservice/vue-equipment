import { computed, toValue, nextTick, type MaybeRef } from 'vue'
import { interpolate, clampValue } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useTrayUtils } from './useTrayUtils'

import type { TrayState, TraySide, TraySnapPoint } from '../../types'

type UseTraySnapArgs = {
  id: MaybeRef<string>
  state: TrayState
}

type SnapToArgs = {
  side: TraySide
  snapPoint: TraySnapPoint
  interpolate: boolean
  duration?: number
}

type InterpolateDraggedArgs = {
  side: TraySide
  to: number
  duration?: number
  easing?: (t: number) => number
}

type FindClosestSnapPointArgs = {
  side: TraySide
  value: number
  direction?: 'below' | 'above' | 'absolute'
}

export function useTraySnap(args: UseTraySnapArgs) {
  const { id, state } = args
  const { isVertical, oppositeSide } = useTrayUtils()
  const emitter = useMagicEmitter()

  const snapPoints = computed(() => state.options.snapPoints)
  const animation = computed(() => state.options.animation)

  // The full extent a side can be inset by, based on the element rect
  function dimension(side: TraySide) {
    const rect = state.elRect
    if (!rect) {
      return 0
    }
    return isVertical(side) ? rect.height : rect.width
  }

  // The maximum inset a side can take without crossing the opposite side
  function maxInset(side: TraySide) {
    return Math.max(0, dimension(side) - state.dragged[oppositeSide(side)])
  }

  // Reserved outer overshoot for a side (0 if the side is not draggable)
  function padding(side: TraySide) {
    return state.overshoot.outer[side]
  }

  // Content extent along a side's axis, minus the outer overshoot on both ends
  function contentExtent(side: TraySide) {
    return Math.max(
      0,
      dimension(side) - padding(side) - padding(oppositeSide(side))
    )
  }

  // Map a snap point (percentage or pixel) to a pixel inset, offset by the padding
  function mapSnapPoint(side: TraySide, snapPoint: TraySnapPoint) {
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

  // Configured snap points mapped to pixels, deduplicated and sorted
  function mappedSnapPoints(side: TraySide) {
    const configured = snapPoints.value[side] ?? []

    const mapped = configured
      .map((snapPoint) => mapSnapPoint(side, snapPoint))
      .filter(
        (value): value is number =>
          value === 0 || (!!value && !Number.isNaN(value))
      )

    return [...new Set(mapped)].sort((a, b) => a - b)
  }

  // Map a pixel inset back to its original snap point input, for events
  function snapPointsMap(side: TraySide) {
    const configured = snapPoints.value[side] ?? []
    const map: Record<number, TraySnapPoint> = {}

    for (const snapPoint of configured) {
      const mapped = mapSnapPoint(side, snapPoint)
      if (mapped || mapped === 0) {
        map[mapped] = snapPoint
      }
    }

    return map
  }

  function findClosestNumber(
    value: number,
    numbers: number[],
    direction: 'below' | 'above' | 'absolute'
  ) {
    if (!numbers.length) {
      return undefined
    }

    let filtered = numbers
    switch (direction) {
      case 'above':
        filtered = numbers.filter((num) => num > value)
        break
      case 'below':
        filtered = numbers.filter((num) => num < value)
        break
    }

    if (filtered.length === 0) {
      switch (direction) {
        case 'above':
          return Math.max(...numbers)
        case 'below':
          return Math.min(...numbers)
        default:
          return undefined
      }
    }

    return filtered.reduce((closest, current) =>
      Math.abs(current - value) < Math.abs(closest - value) ? current : closest
    )
  }

  function findClosestSnapPoint(args: FindClosestSnapPointArgs) {
    const { side, value, direction = 'absolute' } = args
    return findClosestNumber(value, mappedSnapPoints(side), direction)
  }

  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      side,
      to,
      duration = toValue(animation).snap.duration,
      easing = toValue(animation).snap.easing,
    } = args

    const snapPoint = snapPointsMap(side)[to]
    if (!snapPoint && snapPoint !== 0) {
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

    emitter.emit('beforeSnap', { id: toValue(id), side, snapPoint })

    interpolate({
      from: state.dragged[side],
      to,
      duration,
      easing,
      callback: (value: number) => {
        state.dragged[side] = value
        if (state.dragged[side] === to) {
          emitter.emit('afterSnap', { id: toValue(id), side, snapPoint })
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

    const closest = findClosestSnapPoint({ side, value: mapped }) ?? mapped

    if (shouldInterpolate) {
      interpolateDragged({ side, to: closest, duration })
    } else {
      state.dragged[side] = closest
    }

    state.snapped[side] = closest
    state.activeSnapPoint[side] = snapPoint
  }

  return {
    dimension,
    padding,
    contentExtent,
    maxInset,
    mapSnapPoint,
    mappedSnapPoints,
    snapPointsMap,
    findClosestSnapPoint,
    interpolateDragged,
    snapTo,
  }
}
