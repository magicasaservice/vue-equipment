import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createBounce({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  const forward = Array.from({ length: rows }, (_, row) => {
    const indices = Array.from({ length: cols }, (__, col) => row * cols + col)
    return row % 2 === 0 ? indices : [...indices].reverse()
  })
  const backward = [...forward].reverse().map((row) => [...row].reverse())

  return [...forward, ...backward]
}
