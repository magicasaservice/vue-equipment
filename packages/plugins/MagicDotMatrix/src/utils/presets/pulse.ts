import { getRings } from '../sequence/getRings'
import type { DotMatrixGrid, DotMatrixSequence } from '../../types/index'

export function createPulse(grid: DotMatrixGrid): DotMatrixSequence {
  const rings = getRings(grid)
  const expand = rings.map((_, index) => rings.slice(0, index + 1).flat())
  const contract = rings
    .map((_, index) => rings.slice(0, rings.length - index - 1).flat())
    .slice(1)

  return [...expand, ...contract, []]
}
