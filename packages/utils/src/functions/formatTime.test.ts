import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('formats seconds and minutes when under one hour', () => {
    expect(formatTime(65, 65)).toBe('1:05')
  })

  it('formats hours, minutes, and seconds when over one hour', () => {
    expect(formatTime(3661, 3661)).toBe('1:01:01')
  })

  it('shows hours when guide exceeds one hour even if seconds do not', () => {
    expect(formatTime(59, 3600)).toBe('0:00:59')
  })

  it('clamps negative values to zero', () => {
    expect(formatTime(-5, 60)).toBe('0:00')
  })

  it('returns dashes for NaN', () => {
    expect(formatTime(NaN, 60)).toBe('-:-')
  })

  it('returns dashes for Infinity', () => {
    expect(formatTime(Infinity, 60)).toBe('-:-')
  })
})
