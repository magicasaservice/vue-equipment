import { toIndex } from './toIndex'
import type { DotMatrixFrame, DotMatrixGrid } from '../../types/index'

export function getRings({ cols, rows }: DotMatrixGrid): Array<DotMatrixFrame> {
  const centerCol = (cols - 1) / 2
  const centerRow = (rows - 1) / 2
  const maxRing = Math.max(
    Math.ceil(Math.max(centerCol, cols - 1 - centerCol)),
    Math.ceil(Math.max(centerRow, rows - 1 - centerRow))
  )

  return Array.from({ length: maxRing + 1 }, (_, ring) => {
    const indices: DotMatrixFrame = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const distance = Math.max(
          Math.abs(col - centerCol),
          Math.abs(row - centerRow)
        )
        if (Math.floor(distance + 0.5) === ring) {
          indices.push(toIndex({ col, row, cols }))
        }
      }
    }
    return indices
  }).filter((frame) => frame.length > 0)
}
