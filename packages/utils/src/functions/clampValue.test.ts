import { describe, it, expect } from 'vitest'
import { clampValue } from './clampValue'

describe('clampValue', () => {
  it('returns the value when within range', () => {
    expect(clampValue(5, 0, 10)).toBe(5)
  })

  it('returns min when value is below range', () => {
    expect(clampValue(-5, 0, 10)).toBe(0)
  })

  it('returns max when value is above range', () => {
    expect(clampValue(15, 0, 10)).toBe(10)
  })

  it('returns min when value equals min', () => {
    expect(clampValue(0, 0, 10)).toBe(0)
  })

  it('returns max when value equals max', () => {
    expect(clampValue(10, 0, 10)).toBe(10)
  })

  it('works with floats', () => {
    expect(clampValue(0.5, 0, 1)).toBe(0.5)
    expect(clampValue(-0.1, 0, 1)).toBe(0)
    expect(clampValue(1.1, 0, 1)).toBe(1)
  })
})
