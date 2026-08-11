import { equalizerFrame } from '../sequence/equalizerFrame'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createEqualizer({
  cols,
  rows,
}: DotMatrixGrid): DotMatrixSequence {
  const frameCount = 12

  return Array.from({ length: frameCount }, (_, tick) => {
    const heights = Array.from({ length: cols }, (__, col) => {
      const wave =
        (Math.sin((tick / frameCount) * Math.PI * 2 + col * 0.9) + 1) / 2
      return Math.max(1, Math.round(wave * rows))
    })
    return equalizerFrame({ heights, cols, rows })
  })
}
