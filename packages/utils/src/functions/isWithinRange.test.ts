import { describe, it, expect } from 'vitest'
import { isWithinRange } from './isWithinRange'

describe('isWithinRange', () => {
  it('returns true when input equals base', () => {
    expect(isWithinRange({ input: 5, base: 5, threshold: 1 })).toBe(true)
  })

  it('returns true at the lower boundary', () => {
    expect(isWithinRange({ input: 4, base: 5, threshold: 1 })).toBe(true)
  })

  it('returns true at the upper boundary', () => {
    expect(isWithinRange({ input: 6, base: 5, threshold: 1 })).toBe(true)
  })

  it('returns false just below the lower boundary', () => {
    expect(isWithinRange({ input: 3, base: 5, threshold: 1 })).toBe(false)
  })

  it('returns false just above the upper boundary', () => {
    expect(isWithinRange({ input: 7, base: 5, threshold: 1 })).toBe(false)
  })
})
