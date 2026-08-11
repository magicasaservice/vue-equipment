import { ringPath } from '../sequence/ringPath'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createOrbit({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  const path = ringPath({ cols, rows })

  if (path.length === 0) {
    return [[]]
  }

  return path.map((_, index) => [path[index]!])
}
