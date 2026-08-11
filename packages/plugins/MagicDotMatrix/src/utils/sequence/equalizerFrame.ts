import type { DotMatrixFrame } from '../../types/index'

export type EqualizerFrameArgs = {
  heights: Array<number>
  cols: number
  rows: number
}

export function equalizerFrame({
  heights,
  cols,
  rows,
}: EqualizerFrameArgs): DotMatrixFrame {
  return heights.flatMap((height, col) =>
    Array.from(
      { length: Math.max(0, Math.min(height, rows)) },
      (_, index) => (rows - 1 - index) * cols + col
    )
  )
}
