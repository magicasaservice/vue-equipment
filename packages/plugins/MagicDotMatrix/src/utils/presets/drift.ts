import { toIndex } from '../sequence/toIndex'
import type {
  DotMatrixFrame,
  DotMatrixGrid,
  DotMatrixSequence,
} from '../../types/index'

function frameKey(frame: DotMatrixFrame): string {
  return frame.join(',')
}

export function createDrift({ cols, rows }: DotMatrixGrid): DotMatrixSequence {
  const frameCount = 48
  const originCol = (cols - 1) / 2
  const originRow = (rows - 1) / 2

  const frames = Array.from({ length: frameCount }, (_, tick) => {
    const phase = (tick / frameCount) * Math.PI * 2
    const centerCol = originCol + (cols - 1) * 0.38 * Math.sin(phase)
    const centerRow = originRow + (rows - 1) * 0.38 * Math.sin(phase * 2 + 1.05)
    const radius = 1.9 + 0.5 * Math.sin(phase * 3 + 0.5)
    const frame: DotMatrixFrame = []
    let core = 0
    let coreDistance = Infinity

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const distance = Math.hypot(col - centerCol, row - centerRow)
        if (distance < coreDistance) {
          coreDistance = distance
          core = toIndex({ col, row, cols })
        }
        if (distance <= radius) {
          frame.push(toIndex({ col, row, cols }))
        }
      }
    }

    return frame.length > 0 ? frame : [core]
  })

  const moving = frames.filter(
    (frame, index) =>
      index === 0 || frameKey(frame) !== frameKey(frames[index - 1]!)
  )

  while (
    moving.length > 1 &&
    frameKey(moving.at(-1)!) === frameKey(moving[0]!)
  ) {
    moving.pop()
  }

  return moving
}
