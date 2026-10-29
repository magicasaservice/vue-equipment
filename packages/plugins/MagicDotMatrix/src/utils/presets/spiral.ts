import type {
  DotMatrixFrame,
  DotMatrixGrid,
  DotMatrixSequence,
} from '../../types/index'

function spiralOrder({ cols, rows }: DotMatrixGrid): DotMatrixFrame {
  const result: DotMatrixFrame = []
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      result.push(top * cols + col)
    }
    top++
    for (let row = top; row <= bottom; row++) {
      result.push(row * cols + right)
    }
    right--
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(bottom * cols + col)
      }
      bottom--
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(row * cols + left)
      }
      left++
    }
  }

  return result
}

export function createSpiral(grid: DotMatrixGrid): DotMatrixSequence {
  const order = spiralOrder(grid)
  return [...order.map((_, index) => order.slice(0, index + 1)), []]
}
