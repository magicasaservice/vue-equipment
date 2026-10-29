import { getRings } from '../sequence/getRings'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createRipple(grid: DotMatrixGrid): DotMatrixSequence {
  const rings = getRings(grid)
  return [...rings, ...rings.slice(0, -1).reverse(), []]
}
