import { describe, it, expect } from 'vitest'
import { toNumber } from './toNumber'

describe('toNumber', () => {
  it('converts numeric strings to numbers', () => {
    expect(toNumber('5')).toBe(5)
    expect(toNumber('3.14')).toBeCloseTo(3.14)
    expect(toNumber('-1')).toBe(-1)
  })

  it('passes numbers through unchanged', () => {
    expect(toNumber(5)).toBe(5)
    expect(toNumber(-1)).toBe(-1)
    expect(toNumber(0)).toBe(0)
  })

  it('returns NaN for non-numeric strings', () => {
    expect(toNumber('hello')).toBeNaN()
    expect(toNumber('')).toBeNaN()
  })

  it('parses the leading number from mixed strings', () => {
    expect(toNumber('5abc')).toBe(5)
  })
})
