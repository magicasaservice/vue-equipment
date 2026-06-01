import { describe, it, expect, vi, afterEach } from 'vitest'
import { isAndroid } from './isAndroid'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isAndroid', () => {
  it('returns true for an Android user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
    })
    expect(isAndroid()).toBe(true)
  })

  it('returns false for a non-Android user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    })
    expect(isAndroid()).toBe(false)
  })

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isAndroid()).toBe(false)
  })
})
