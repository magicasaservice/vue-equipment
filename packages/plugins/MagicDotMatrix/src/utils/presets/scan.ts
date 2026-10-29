import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createScan({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (__, col) => row * cols + col)
  )
}
