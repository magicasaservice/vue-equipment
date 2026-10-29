import { rubberband } from '@maas/vue-equipment/utils'

import type {
  MagicTraySide,
  MagicTraySnapEntry,
  MagicTraySnapRange,
  TraySnapPoints,
} from '../../types'

export const SIDES: Array<MagicTraySide> = ['top', 'right', 'bottom', 'left']

type IsDraggableSideArgs = {
  snapPoints: TraySnapPoints
  side: MagicTraySide
}

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
  function isVertical(side: MagicTraySide) {
    return side === 'top' || side === 'bottom'
  }

  // The side opposite to the given side
  function oppositeSide(side: MagicTraySide): MagicTraySide {
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

  function isSnapRange(entry: MagicTraySnapEntry): entry is MagicTraySnapRange {
    return typeof entry === 'object'
  }

  // Single snap points plus both ends of every range
  function flattenSnapPoints(entries: Array<MagicTraySnapEntry>) {
    return entries.flatMap((entry) =>
      isSnapRange(entry) ? [entry.min, entry.max] : [entry]
    )
  }

  // A side becomes draggable with its first snap point
  function isDraggableSide(args: IsDraggableSideArgs) {
    const { snapPoints, side } = args
    return (snapPoints[side]?.length ?? 0) > 0
  }

  return {
    clampWithOvershoot,
    isVertical,
    oppositeSide,
    isSnapRange,
    flattenSnapPoints,
    isDraggableSide,
  }
}
