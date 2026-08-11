import { describe, it, expect } from 'vitest'
import {
  createCheckerboard,
  createDrift,
  createFocus,
  createEqualizer,
  createOrbit,
  createComet,
  createPulse,
  createFill,
  createRipple,
  createScan,
  createSpiral,
  createBounce,
} from '../src/utils/presets/index'
import { ringPath } from '../src/utils/sequence/ringPath'
import { withTrail } from '../src/utils/sequence/withTrail'
import type { DotMatrixGrid, DotMatrixSequence } from '../src/types'

const presets: Array<{
  name: string
  create: (grid: DotMatrixGrid) => DotMatrixSequence
}> = [
  { name: 'checkerboard', create: createCheckerboard },
  { name: 'drift', create: createDrift },
  { name: 'focus', create: createFocus },
  { name: 'equalizer', create: createEqualizer },
  { name: 'orbit', create: createOrbit },
  { name: 'comet', create: createComet },
  { name: 'pulse', create: createPulse },
  { name: 'fill', create: createFill },
  { name: 'ripple', create: createRipple },
  { name: 'scan', create: createScan },
  { name: 'spiral', create: createSpiral },
  { name: 'bounce', create: createBounce },
]

describe('MagicDotMatrix - Presets', () => {
  describe.each([
    { cols: 7, rows: 7 },
    { cols: 3, rows: 5 },
    { cols: 1, rows: 1 },
  ])('on a $cols x $rows grid', (grid) => {
    it.each(presets)(
      '$name returns frames with valid indices',
      ({ create }) => {
        const sequence = create(grid)
        const total = grid.cols * grid.rows

        expect(sequence.length).toBeGreaterThan(0)

        for (const frame of sequence) {
          for (const index of frame) {
            expect(Number.isInteger(index)).toBe(true)
            expect(index).toBeGreaterThanOrEqual(0)
            expect(index).toBeLessThan(total)
          }
        }
      }
    )
  })

  it('scan sweeps one row per frame', () => {
    const sequence = createScan({ cols: 3, rows: 4 })

    expect(sequence.length).toBe(4)
    expect(sequence[0]).toEqual([0, 1, 2])
    expect(sequence[3]).toEqual([9, 10, 11])
  })

  it('checkerboard alternates two complementary fields', () => {
    const sequence = createCheckerboard({ cols: 2, rows: 2 })

    expect(sequence.length).toBe(4)
    expect([...sequence[0]!, ...sequence[1]!].sort()).toEqual([0, 1, 2, 3])
  })

  it('orbit visits every perimeter cell once', () => {
    const sequence = createOrbit({ cols: 4, rows: 4 })

    expect(sequence.length).toBe(12)
    expect(new Set(sequence.flat()).size).toBe(12)
  })

  it('ringPath walks the perimeter clockwise', () => {
    const path = ringPath({ cols: 3, rows: 3 })

    expect(path).toEqual([0, 1, 2, 5, 8, 7, 6, 3])
  })

  it('withTrail appends upcoming cells to each frame', () => {
    const sequence = withTrail({ path: [0, 1, 2, 3], length: 2 })

    expect(sequence[0]).toEqual([0, 1])
    expect(sequence[3]).toEqual([3, 0])
  })
})
