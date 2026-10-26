import { computed, nextTick, shallowRef, toValue } from 'vue'
import {
  clampValue,
  interpolate,
  mapValue,
  snapRangeAt,
  snapTargetAt,
} from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useDrawerUtils } from './useDrawerUtils'

import type { MaybeRef, Ref } from 'vue'

import type {
  MagicDrawerSnapPoint,
  MagicDrawerSnapRange,
  RequiredMagicDrawerOptions,
} from '../../types'

type UseDrawerSnapArgs = {
  id: MaybeRef<string>
  wrapperRect: Ref<DOMRect | undefined>
  draggedY: Ref<number>
  draggedX: Ref<number>
  activeSnapPoint: Ref<MagicDrawerSnapPoint | undefined>
  position: MaybeRef<RequiredMagicDrawerOptions['position']>
  animation: MaybeRef<RequiredMagicDrawerOptions['animation']>
  snapPoints: MaybeRef<RequiredMagicDrawerOptions['snapPoints']>
  preventDragClose: MaybeRef<RequiredMagicDrawerOptions['preventDragClose']>
  overshoot: MaybeRef<number>
}

type SnapToArgs = {
  snapPoint: MagicDrawerSnapPoint
  interpolate: boolean
  duration?: number
}

type InterpolateDraggedArgs = {
  to: number
  duration?: number
  easing?: (t: number) => number
}

type MappedSnapRange = {
  min: number
  max: number
  momentum?: boolean
  range: MagicDrawerSnapRange
}

function isMapped(value: number | undefined): value is number {
  return value !== undefined && !Number.isNaN(value)
}

function roundDecimal(value: number) {
  return Math.round(value * 10000) / 10000
}

export function useDrawerSnap(args: UseDrawerSnapArgs) {
  const {
    id,
    snapPoints,
    animation,
    position,
    wrapperRect,
    overshoot,
    draggedY,
    draggedX,
    activeSnapPoint,
    preventDragClose,
  } = args

  const { isSnapRange, flattenSnapPoints } = useDrawerUtils()
  const emitter = useMagicEmitter()

  // Private state
  const isVertical = computed(() => {
    const side = toValue(position)
    return side === 'top' || side === 'bottom'
  })

  // Snap points and range ends, plus the closed position unless dragging
  // can’t close the drawer
  const configuredPoints = computed(() => {
    const flattened = flattenSnapPoints(toValue(snapPoints))
    return toValue(preventDragClose) ? flattened : [...flattened, 0]
  })

  // Public state
  const snappedY = shallowRef(0)
  const snappedX = shallowRef(0)

  const drawerHeight = computed(() => {
    const rect = toValue(wrapperRect)
    if (rect === undefined) {
      return 0
    }
    return rect.height - toValue(overshoot)
  })

  const drawerWidth = computed(() => {
    const rect = toValue(wrapperRect)
    if (rect === undefined) {
      return 0
    }
    return rect.width - toValue(overshoot)
  })

  // Snap points and range ends mapped to pixels, deduplicated and sorted
  const mappedSnapPoints = computed(() => {
    const mapped = configuredPoints.value.map(mapSnapPoint).filter(isMapped)
    return [...new Set(mapped)].sort((a, b) => a - b)
  })

  // Configured ranges mapped to pixels, ends ordered
  const mappedRanges = computed<Array<MappedSnapRange>>(() =>
    toValue(snapPoints)
      .filter(isSnapRange)
      .flatMap((range) => {
        const min = mapSnapPoint(range.min)
        const max = mapSnapPoint(range.max)

        if (!isMapped(min) || !isMapped(max)) {
          return []
        }

        return [
          {
            min: Math.min(min, max),
            max: Math.max(min, max),
            momentum: range.momentum,
            range,
          },
        ]
      })
  )

  // Private functions
  function mapSnapPoint(snapPoint: MagicDrawerSnapPoint) {
    if (typeof snapPoint === 'number') {
      // Reverse snap point percentages,
      // so that 0% is the top of the drawer
      const reversedSnapPoint = mapValue(snapPoint, 0, 1, 1, 0)
      const vh = window.innerHeight
      const vw = window.innerWidth

      // Save guard against NaN
      if (toValue(wrapperRect) === undefined) {
        return undefined
      }

      // Any value between 0 and 1 gets mapped to the viewport
      // 0 and 1 get mapped to the wrapperRect
      switch (position) {
        case 'bottom': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) {
            return drawerHeight.value
          }
          if (reversedSnapPoint === 0) {
            return 0
          }
          if (!rect) {
            return 0
          }
          return vh * reversedSnapPoint - rect.top
        }

        case 'top': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) {
            return drawerHeight.value * -1
          }
          if (reversedSnapPoint === 0) {
            return 0
          }
          if (!rect) {
            return 0
          }
          return vh * reversedSnapPoint - rect.bottom
        }

        case 'right': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) {
            return drawerWidth.value
          }
          if (reversedSnapPoint === 0) {
            return 0
          }
          if (!rect) {
            return 0
          }
          return vw * reversedSnapPoint - rect.left
        }

        case 'left': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) {
            return drawerWidth.value * -1
          }
          if (reversedSnapPoint === 0) {
            return 0
          }
          if (!rect) {
            return 0
          }
          return vw * reversedSnapPoint - rect.right
        }

        default:
          return 0
      }
    } else {
      // Convert snap point to number
      const parsedSnapPoint = parseFloat(snapPoint)

      // Save guard against NaN
      if (!drawerHeight.value || !drawerWidth.value) {
        return undefined
      }

      // Calculate snap point
      // related to dimensions and position
      switch (position) {
        case 'bottom':
          return drawerHeight.value - parsedSnapPoint
        case 'top':
          return (drawerHeight.value - parsedSnapPoint) * -1
        case 'right':
          return drawerWidth.value - parsedSnapPoint
        case 'left':
          return (drawerWidth.value - parsedSnapPoint) * -1
        default:
          return parseFloat(snapPoint)
      }
    }
  }

  // A decimal snap point for a pixel offset, the reverse of mapSnapPoint
  // between 0 and 1
  function decimalAt(offset: number) {
    const rect = toValue(wrapperRect)

    if (!rect) {
      return 0
    }

    switch (position) {
      case 'bottom':
        return 1 - (offset + rect.top) / window.innerHeight
      case 'top':
        return 1 - (offset + rect.bottom) / window.innerHeight
      case 'right':
        return 1 - (offset + rect.left) / window.innerWidth
      case 'left':
        return 1 - (offset + rect.right) / window.innerWidth
      default:
        return 0
    }
  }

  // A pixel snap point for a pixel offset, the reverse of mapSnapPoint
  function pixelsAt(offset: number) {
    switch (position) {
      case 'bottom':
        return drawerHeight.value - offset
      case 'top':
        return drawerHeight.value + offset
      case 'right':
        return drawerWidth.value - offset
      case 'left':
        return drawerWidth.value + offset
      default:
        return offset
    }
  }

  // The configured snap point a pixel offset maps to, if any
  function configuredPointAt(offset: number) {
    return configuredPoints.value.find((snapPoint) => {
      const mapped = mapSnapPoint(snapPoint)
      return mapped === offset
    })
  }

  function draggedOnAxis() {
    return isVertical.value ? draggedY.value : draggedX.value
  }

  function setDraggedOnAxis(value: number) {
    if (isVertical.value) {
      draggedY.value = value
    } else {
      draggedX.value = value
    }
  }

  function setSnappedOnAxis(value: number) {
    if (isVertical.value) {
      snappedY.value = value
    } else {
      snappedX.value = value
    }
  }

  // Public functions

  // The range a pixel offset lies within, ends included
  function rangeAt(offset: number) {
    return snapRangeAt({ ranges: mappedRanges.value, position: offset })
  }

  // The snap point a pixel offset resolves to: a configured point, or a
  // value inside a range, rounded to four decimals when both of its ends are
  // decimals and to whole pixels otherwise
  function snapPointAt(offset: number): MagicDrawerSnapPoint | undefined {
    const configured = configuredPointAt(offset)

    if (configured !== undefined) {
      return configured
    }

    const mapped = rangeAt(offset)

    if (!mapped) {
      return undefined
    }

    const { min, max } = mapped.range

    return typeof min === 'number' && typeof max === 'number'
      ? roundDecimal(decimalAt(offset))
      : `${Math.round(pixelsAt(offset))}px`
  }

  // The offset a value inside a range rests at, so it matches the rounded
  // snap point it reports
  function restingOffset(offset: number) {
    const range = rangeAt(offset)
    const snapPoint = snapPointAt(offset)

    if (!range || snapPoint === undefined) {
      return offset
    }

    const mapped = mapSnapPoint(snapPoint)

    return isMapped(mapped) ? clampValue(mapped, range.min, range.max) : offset
  }

  // Whether a snap point maps onto a configured point or into a range
  function isSnapTarget(snapPoint: MagicDrawerSnapPoint) {
    const mapped = mapSnapPoint(snapPoint)

    if (!isMapped(mapped)) {
      return false
    }

    return !!rangeAt(mapped) || mappedSnapPoints.value.includes(mapped)
  }

  // Where a pixel offset lands without a drag: in place inside a range,
  // otherwise at the closest snap point
  function findSnapTarget(offset: number) {
    const target = snapTargetAt({
      points: mappedSnapPoints.value,
      ranges: mappedRanges.value,
      value: offset,
    })

    return target === undefined ? undefined : restingOffset(target)
  }

  async function snapTo(args: SnapToArgs) {
    const { snapPoint, interpolate: shouldInterpolate, duration } = args
    await nextTick()

    const mapped = mapSnapPoint(snapPoint)

    if (!isMapped(mapped)) {
      return
    }

    const closest = findSnapTarget(mapped) ?? 0

    // Commit first, as an interpolation that is already in place emits
    // afterSnap right away. Snapped is also read on resize.
    setSnappedOnAxis(closest)
    activeSnapPoint.value = snapPointAt(closest) ?? snapPoint

    if (shouldInterpolate) {
      interpolateDragged({ to: closest, duration })
    } else {
      setDraggedOnAxis(closest)
    }
  }

  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      to,
      duration = toValue(animation).snap.duration,
      easing = toValue(animation).snap.easing,
    } = args

    const snapPoint = snapPointAt(to)

    if (snapPoint === undefined) {
      return
    }

    emitter.emit('beforeSnap', { id: toValue(id), snapPoint })

    // Already in place, as after a release inside a range; animating from
    // and to the same value would emit afterSnap on every frame
    if (draggedOnAxis() === to) {
      emitter.emit('afterSnap', { id: toValue(id), snapPoint })
      return
    }

    interpolate({
      from: draggedOnAxis(),
      to,
      duration,
      easing,
      callback: (value: number) => {
        setDraggedOnAxis(value)
        if (value === to) {
          emitter.emit('afterSnap', { id: toValue(id), snapPoint })
        }
      },
    })
  }

  return {
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
  }
}
