import { describe, it, expect, vi, afterEach } from 'vitest'
import { scrollbarGutterSupport } from './scrollbarGutterSupport'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('scrollbarGutterSupport', () => {
  it('returns true when CSS supports scrollbar-gutter: stable', () => {
    vi.stubGlobal('CSS', { supports: () => true })
    expect(scrollbarGutterSupport()).toBe(true)
  })

  it('returns false when CSS does not support scrollbar-gutter: stable', () => {
    vi.stubGlobal('CSS', { supports: () => false })
    expect(scrollbarGutterSupport()).toBe(false)
  })
})
