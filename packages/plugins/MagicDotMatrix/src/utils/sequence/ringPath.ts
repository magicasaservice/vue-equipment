import { toIndex } from './toIndex'
import type { DotMatrixFrame } from '../../types/index'

export type RingPathArgs = {
  cols: number
  rows: number
  inset?: number
}

// Clockwise perimeter path of the grid rect inset by `inset` cells
export function ringPath({
  cols,
  rows,
  inset = 0,
}: RingPathArgs): DotMatrixFrame {
  const left = inset
  const top = inset
  const right = cols - 1 - inset
  const bottom = rows - 1 - inset

  if (left > right || top > bottom) {
    return []
  }
  if (left === right && top === bottom) {
    return [toIndex({ col: left, row: top, cols })]
  }

  const path: DotMatrixFrame = []
  for (let col = left; col <= right; col++) {
    path.push(toIndex({ col, row: top, cols }))
  }
  for (let row = top + 1; row <= bottom; row++) {
    path.push(toIndex({ col: right, row, cols }))
  }
  if (bottom > top) {
    for (let col = right - 1; col >= left; col--) {
      path.push(toIndex({ col, row: bottom, cols }))
    }
  }
  if (right > left) {
    for (let row = bottom - 1; row > top; row--) {
      path.push(toIndex({ col: left, row, cols }))
    }
  }
  return path
}
