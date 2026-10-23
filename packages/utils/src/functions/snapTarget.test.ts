import { describe, it, expect } from 'vitest'
import {
  closestSnapPoint,
  snapCommit,
  snapRangeAt,
  snapRelease,
  snapTargetAt,
} from './snapTarget'

import type { SnapDrag } from './snapTarget'

const range = { min: 60, max: 140 }
const points = [0, 60, 140, 180]
const ranges = [range]

function drag(overrides: Partial<SnapDrag>): SnapDrag {
  return {
    points,
    ranges,
    mode: 'closest',
    rest: 0,
    start: 0,
    position: 0,
    ...overrides,
  }
}

describe('snapRangeAt', () => {
  it('finds the range a position lies within, ends included', () => {
    expect(snapRangeAt({ ranges, position: 100 })).toBe(range)
    expect(snapRangeAt({ ranges, position: 60 })).toBe(range)
    expect(snapRangeAt({ ranges, position: 140 })).toBe(range)
    expect(snapRangeAt({ ranges, position: 150 })).toBeUndefined()
  })
})

describe('closestSnapPoint', () => {
  it('finds the closest point either way', () => {
    expect(closestSnapPoint({ points, value: 50 })).toBe(60)
    expect(closestSnapPoint({ points, value: 20 })).toBe(0)
  })

  it('finds the next point in a direction', () => {
    expect(closestSnapPoint({ points, value: 100, direction: 'above' })).toBe(
      140
    )
    expect(closestSnapPoint({ points, value: 100, direction: 'below' })).toBe(
      60
    )
  })

  it('falls back to the outermost point past the last one', () => {
    expect(closestSnapPoint({ points, value: 200, direction: 'above' })).toBe(
      180
    )
    expect(closestSnapPoint({ points, value: 0, direction: 'below' })).toBe(0)
  })

  it('returns undefined without points', () => {
    expect(closestSnapPoint({ points: [], value: 10 })).toBeUndefined()
  })
})

describe('snapTargetAt', () => {
  it('keeps a value inside a range and snaps anything else', () => {
    expect(snapTargetAt({ points, ranges, value: 100 })).toBe(100)
    expect(snapTargetAt({ points, ranges, value: 170 })).toBe(180)
  })
})

describe('snapCommit', () => {
  const thresholds = { distance: 8, flicked: false }

  it('commits to the closest point in the drag direction past the distance', () => {
    expect(snapCommit({ ...drag({ position: 30 }), ...thresholds })).toBe(60)
    expect(
      snapCommit({
        ...drag({ rest: 180, start: 180, position: 30 }),
        ...thresholds,
      })
    ).toBe(0)
  })

  it('reverts within the distance', () => {
    expect(snapCommit({ ...drag({ position: 5 }), ...thresholds })).toBe(
      undefined
    )
  })

  it('never counts travel inside the range the side rests in', () => {
    expect(
      snapCommit({
        ...drag({ rest: 100, start: 100, position: 145 }),
        ...thresholds,
      })
    ).toBe(undefined)
  })

  it("steps from where the side rests in 'step' mode", () => {
    expect(
      snapCommit({
        ...drag({ mode: 'step', rest: 60, start: 60, position: 170 }),
        ...thresholds,
      })
    ).toBe(140)
  })

  it('commits a flick short of the distance', () => {
    expect(
      snapCommit({
        ...drag({ position: 5 }),
        distance: 8,
        flicked: true,
        flickDirection: 'above',
      })
    ).toBe(60)
  })
})

describe('snapRelease', () => {
  const release = { committed: undefined, flicked: false, tapped: false }

  it('rests in place inside a range', () => {
    expect(snapRelease({ ...drag({ position: 100 }), ...release })).toBe(100)
  })

  it('reverts a tap, even inside a range', () => {
    expect(
      snapRelease({
        ...drag({ rest: 60, start: 66, position: 66 }),
        ...release,
        tapped: true,
      })
    ).toBe(60)
  })

  it('carries a flick inside a range on to the committed point', () => {
    expect(
      snapRelease({
        ...drag({ rest: 100, start: 100, position: 120 }),
        committed: 140,
        flicked: true,
        tapped: false,
      })
    ).toBe(140)
  })

  it('returns to the range end it left by less than the distance', () => {
    expect(
      snapRelease({
        ...drag({ rest: 100, start: 100, position: 55 }),
        ...release,
      })
    ).toBe(60)
  })

  it('rests a flick in place inside a range without momentum', () => {
    expect(
      snapRelease({
        ...drag({
          ranges: [{ ...range, momentum: false }],
          rest: 100,
          start: 100,
          position: 120,
        }),
        committed: 140,
        flicked: true,
        tapped: false,
      })
    ).toBe(120)
  })

  it("rests inside the range it steps into in 'step' mode", () => {
    expect(
      snapRelease({
        ...drag({ mode: 'step', position: 100 }),
        ...release,
        committed: 60,
      })
    ).toBe(100)
  })

  it("never skips a point to rest in a range past it in 'step' mode", () => {
    const layout = {
      points: [0, 40, 80, 120, 160],
      ranges: [
        { min: 40, max: 80 },
        { min: 120, max: 160 },
      ],
    }

    expect(
      snapRelease({
        ...drag({ ...layout, mode: 'step', position: 140 }),
        ...release,
        committed: 40,
      })
    ).toBe(40)
  })
})
