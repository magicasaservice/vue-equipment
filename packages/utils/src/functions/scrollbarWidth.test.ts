import { describe, it, expect } from 'vitest'
import { scrollbarWidth } from './scrollbarWidth'

describe('scrollbarWidth', () => {
  it('returns a non-negative number', () => {
    expect(scrollbarWidth()).toBeGreaterThanOrEqual(0)
  })

  it('removes the measurement element from the DOM after measuring', () => {
    const before = document.body.children.length
    scrollbarWidth()
    expect(document.body.children.length).toBe(before)
  })
})
