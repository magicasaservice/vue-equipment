import type { TraySide } from '../../types'
import { clampValue } from '@maas/vue-equipment/utils'

export function useTrayUtils() {
  // Rubber-band resistance: maps an unbounded overdrag distance onto a
  // diminishing offset that asymptotically approaches `max`. This is what
  // makes dragging past a bound feel elastic instead of hitting a wall.
  function rubberband(distance: number, max: number) {
    if (max <= 0 || distance <= 0) {
      return 0
    }
    return (1 - 1 / (distance / max + 1)) * max
  }

  // Clamp a value to [min, max], but allow it to travel past either bound
  // with rubber-band resistance, up to `overshoot` pixels.
  function clampWithOvershoot(
    value: number,
    min: number,
    max: number,
    overshoot: number
  ) {
    if (overshoot <= 0) {
      return clampValue(value, min, max)
    }
    if (value < min) {
      return min - rubberband(min - value, overshoot)
    }
    if (value > max) {
      return max + rubberband(value - max, overshoot)
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
    rubberband,
    clampWithOvershoot,
    isVertical,
    oppositeSide,
  }
}
