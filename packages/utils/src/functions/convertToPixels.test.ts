import { describe, it, expect, beforeEach } from 'vitest'
import { convertToPixels } from './convertToPixels'

describe('convertToPixels', () => {
  beforeEach(() => {
    document.body.style.fontSize = '16px'
  })

  it('returns the numeric value for px', () => {
    expect(convertToPixels('48px')).toBe(48)
    expect(convertToPixels('0px')).toBe(0)
    expect(convertToPixels('12.5px')).toBe(12.5)
  })

  it('resolves rem against the root font size', () => {
    expect(convertToPixels('3rem')).toBe(48)
    expect(convertToPixels('0.5rem')).toBe(8)
  })

  it('tracks a custom root font size for rem', () => {
    document.body.style.fontSize = '10px'
    expect(convertToPixels('3rem')).toBe(30)
  })

  it('tolerates surrounding whitespace', () => {
    expect(convertToPixels('  24px ')).toBe(24)
    expect(convertToPixels('1 rem')).toBe(16)
  })

  it('returns undefined for unsupported units or garbage', () => {
    expect(convertToPixels('100%')).toBeUndefined()
    expect(convertToPixels('10em')).toBeUndefined()
    expect(convertToPixels('auto')).toBeUndefined()
    expect(convertToPixels('')).toBeUndefined()
  })
})
