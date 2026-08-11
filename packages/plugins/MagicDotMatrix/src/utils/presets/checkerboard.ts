import type {
  DotMatrixFrame,
  DotMatrixGrid,
  DotMatrixSequence,
} from '../../types/index'

export function createCheckerboard({
  cols,
  rows,
}: DotMatrixGrid): DotMatrixSequence {
  const even: DotMatrixFrame = []
  const odd: DotMatrixFrame = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      if ((row + col) % 2 === 0) {
        even.push(index)
      } else {
        odd.push(index)
      }
    }
  }

  return [even, odd, even, odd]
}
