import { describe, it, expect } from 'vitest'
import { useEasings } from './index'

describe('useEasings', () => {
  it('returns all 14 easing functions', () => {
    expect(Object.keys(useEasings())).toHaveLength(14)
  })

  it('all returned values are functions', () => {
    for (const fn of Object.values(useEasings())) {
      expect(typeof fn).toBe('function')
    }
  })
})
