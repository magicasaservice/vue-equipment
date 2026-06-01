import { describe, it, expect } from 'vitest'
import { mapValue } from './mapValue'

describe('mapValue', () => {
  it('maps the midpoint of the input range to the midpoint of the output range', () => {
    expect(mapValue(5, 0, 10, 0, 100)).toBe(50)
  })

  it('maps input min to output min', () => {
    expect(mapValue(0, 0, 10, 0, 100)).toBe(0)
  })

  it('maps input max to output max', () => {
    expect(mapValue(10, 0, 10, 0, 100)).toBe(100)
  })

  it('works with a negative output range', () => {
    expect(mapValue(5, 0, 10, -100, 0)).toBe(-50)
  })

  it('works with floats', () => {
    expect(mapValue(0.5, 0, 1, 0, 100)).toBe(50)
  })
})
