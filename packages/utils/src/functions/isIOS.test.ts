import { describe, it, expect, vi, afterEach } from 'vitest'
import { isIOS } from './isIOS'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isIOS', () => {
  it('returns true for an iPhone user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    })
    expect(isIOS()).toBe(true)
  })

  it('returns true for an iPad user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
    })
    expect(isIOS()).toBe(true)
  })

  it('returns true for an iPod user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 16_0 like Mac OS X)',
    })
    expect(isIOS()).toBe(true)
  })

  it('returns false for a non-iOS user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
    })
    expect(isIOS()).toBe(false)
  })

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isIOS()).toBe(false)
  })
})
