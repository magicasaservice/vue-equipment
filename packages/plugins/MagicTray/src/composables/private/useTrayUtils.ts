import { rubberband } from '@maas/vue-equipment/utils'
import type { TraySide } from '../../types'

export function useTrayUtils() {
  // Clamp to [min, max], allowing rubber-band travel up to `outer` pixels past
  // the open extreme and `inner` pixels past the closed extreme
  function clampWithOvershoot(
    value: number,
    min: number,
    max: number,
    outer: number,
    inner: number
  ) {
    if (value < min) {
      return outer > 0 ? min - rubberband(min - value, outer) : min
    }
    if (value > max) {
      return inner > 0 ? max + rubberband(value - max, inner) : max
    }
    return value
  }

  // The axis a given side is dragged along
  function isVertical(side: TraySide) {
    return side === 'top' || side === 'bottom'
  }

  // The side opposite to the given side
  function oppositeSide(side: TraySide): TraySide {
    switch (side) {
      case 'top':
        return 'bottom'
      case 'bottom':
        return 'top'
      case 'left':
        return 'right'
      case 'right':
        return 'left'
    }
  }

  return {
    clampWithOvershoot,
    isVertical,
    oppositeSide,
  }
}
