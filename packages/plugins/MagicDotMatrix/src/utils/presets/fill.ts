import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createFill({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  const total = cols * rows

  return [
    ...Array.from({ length: total }, (_, index) =>
      Array.from({ length: index + 1 }, (__, dot) => dot)
    ),
    [],
  ]
}
