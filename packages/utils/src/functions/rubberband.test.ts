import { describe, it, expect } from 'vitest'
import { rubberband } from './rubberband'

describe('rubberband', () => {
  it('returns 0 for non-positive distance or max', () => {
    expect(rubberband(0, 100)).toBe(0)
    expect(rubberband(-10, 100)).toBe(0)
    expect(rubberband(50, 0)).toBe(0)
    expect(rubberband(50, -100)).toBe(0)
  })

  it('eases out and stays below max (asymptotic, never reaches the edge)', () => {
    const max = 100
    expect(rubberband(max, max)).toBeCloseTo((2 / 3) * max) // ~66.7
    expect(rubberband(2 * max, max)).toBeCloseTo(0.8 * max) // 80
    expect(rubberband(1e9, max)).toBeLessThan(max)
  })

  it('increases monotonically with distance', () => {
    const a = rubberband(10, 100)
    const b = rubberband(50, 100)
    const c = rubberband(200, 100)
    expect(a).toBeLessThan(b)
    expect(b).toBeLessThan(c)
  })

  it('climbs toward the edge sooner with higher tightness', () => {
    expect(rubberband(100, 100, 3)).toBeGreaterThan(rubberband(100, 100, 1))
  })
})
