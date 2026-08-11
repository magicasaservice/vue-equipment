import { getRings } from '../sequence/getRings'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createFocus(grid: DotMatrixGrid): DotMatrixSequence {
  const rings = [...getRings(grid)].reverse()
  return [...rings, ...rings.slice(0, -1).reverse(), []]
}
