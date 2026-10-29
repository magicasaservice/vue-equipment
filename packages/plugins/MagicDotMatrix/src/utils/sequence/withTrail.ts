import type { DotMatrixFrame, DotMatrixSequence } from '../../types/index'

export type WithTrailArgs = {
  path: DotMatrixFrame
  length?: number
}

// Renders a path as frames where each frame shows the current cell plus
// the next `length - 1` cells as a comet trail
export function withTrail({
  path,
  length = 3,
}: WithTrailArgs): DotMatrixSequence {
  if (path.length === 0) {
    return [[]]
  }

  const trail = Math.max(1, Math.min(length, path.length))

  return path.map((_, index) => [
    ...new Set(
      Array.from(
        { length: trail },
        (__, offset) => path[(index + offset) % path.length]!
      )
    ),
  ])
}
