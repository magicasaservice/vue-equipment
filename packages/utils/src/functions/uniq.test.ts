import { describe, it, expect } from 'vitest'
import { uniq } from './uniq'

describe('uniq', () => {
  it('removes duplicate numbers', () => {
    expect(uniq([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('removes duplicate strings', () => {
    expect(uniq(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('preserves the order of first occurrence', () => {
    expect(uniq([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })

  it('returns an empty array for empty input', () => {
    expect(uniq([])).toEqual([])
  })

  it('uses reference equality for objects', () => {
    const a = { x: 1 }
    const b = { x: 1 }
    expect(uniq([a, b, a])).toEqual([a, b])
  })
})
