import { clampValue } from './clampValue'

export type SnapRange = {
  min: number
  max: number
  // False keeps a flick released inside the range from carrying on
  momentum?: boolean
}

export type SnapDirection = 'below' | 'above'

export type SnapMode = 'closest' | 'step'

// A drag along one axis, in pixels
export type SnapDrag = {
  // Snap points and range ends, sorted ascending
  points: Array<number>
  ranges: Array<SnapRange>
  mode: SnapMode
  // Where the side rests, where the drag started, and where it is now
  rest: number
  start: number
  position: number
}

type SnapRangeAtArgs<RangeType extends SnapRange> = {
  ranges: Array<RangeType>
  position: number
}

type ClosestSnapPointArgs = {
  points: Array<number>
  value: number
  direction?: SnapDirection | 'absolute'
}

type SnapTargetAtArgs = {
  points: Array<number>
  ranges: Array<SnapRange>
  value: number
}

type SnapCommitArgs = SnapDrag & {
  distance: number
  flicked: boolean
  flickDirection?: SnapDirection
}

type SnapReleaseArgs = SnapDrag & {
  committed: number | undefined
  flicked: boolean
  tapped: boolean
}

// The range a position lies within, ends included
export function snapRangeAt<RangeType extends SnapRange>(
  args: SnapRangeAtArgs<RangeType>
) {
  const { ranges, position } = args

  return ranges.find((range) => position >= range.min && position <= range.max)
}

// The closest point to a value, in a direction or either way. With nothing
// past the value in the direction, the outermost point that way.
export function closestSnapPoint(args: ClosestSnapPointArgs) {
  const { points, value, direction = 'absolute' } = args

  if (!points.length) {
    return undefined
  }

  switch (direction) {
    case 'above':
      return points.find((point) => point > value) ?? points.at(-1)
    case 'below':
      return [...points].reverse().find((point) => point < value) ?? points[0]
    case 'absolute':
      return points.reduce((closest, point) =>
        Math.abs(point - value) < Math.abs(closest - value) ? point : closest
      )
  }
}

// Where a value lands without a drag: in place inside a range, otherwise at
// the closest point
export function snapTargetAt(args: SnapTargetAtArgs) {
  const { points, ranges, value } = args

  return snapRangeAt({ ranges, position: value })
    ? value
    : closestSnapPoint({ points, value })
}

// For a drag that started inside a range, the position clamped to that
// range, so travel within the range never counts toward a snap
function clampToRestRange(drag: SnapDrag) {
  const range = snapRangeAt({ ranges: drag.ranges, position: drag.rest })

  return range ? clampValue(drag.position, range.min, range.max) : undefined
}

// The closest point in the drag direction, or in 'step' mode the next one
// from where the side rests
function nextSnapPoint(args: SnapDrag & { direction: SnapDirection }) {
  const { points, mode, rest, position, direction } = args
  const value = mode === 'step' ? rest : position

  return closestSnapPoint({ points, value, direction })
}

// A release inside a range rests in place, unless flicked in a range with
// momentum. In 'step' mode only inside the range the side rests in, or the
// one whose end is the next step.
function restsInRange(args: SnapDrag & { flicked: boolean }) {
  const { ranges, mode, rest, position, flicked } = args
  const range = snapRangeAt({ ranges, position })

  if (!range || (flicked && range.momentum !== false)) {
    return false
  }

  const startsInside = rest >= range.min && rest <= range.max

  if (mode !== 'step' || startsInside) {
    return true
  }

  const direction = position < rest ? 'below' : 'above'
  const next = nextSnapPoint({ ...args, direction })

  return next === (direction === 'above' ? range.min : range.max)
}

// The point a drag commits to once it passes the distance threshold or is
// flicked, otherwise undefined so a release reverts
export function snapCommit(args: SnapCommitArgs) {
  const { distance, flicked, flickDirection, ...drag } = args
  const delta = drag.position - (clampToRestRange(drag) ?? drag.start)

  if (Math.abs(delta) > distance) {
    return nextSnapPoint({ ...drag, direction: delta < 0 ? 'below' : 'above' })
  }

  if (flicked && flickDirection) {
    return nextSnapPoint({ ...drag, direction: flickDirection })
  }

  return undefined
}

// Where a release comes to rest: in place inside a range, at the committed
// point, or back where the drag started. A tap never rests inside a range,
// or a pulled handle would keep the pulled position.
export function snapRelease(args: SnapReleaseArgs) {
  const { committed, flicked, tapped, ...drag } = args

  if (tapped) {
    return committed ?? drag.rest
  }

  if (restsInRange({ ...drag, flicked })) {
    return drag.position
  }

  return committed ?? clampToRestRange(drag) ?? drag.rest
}
