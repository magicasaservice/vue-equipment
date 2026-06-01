import { describe, it, expect } from 'vitest'
import { matchClass } from './matchClass'

describe('matchClass', () => {
  it('returns true when an element has a matching class', () => {
    const el = document.createElement('div')
    el.classList.add('foo', 'bar')
    expect(matchClass(el, /foo/)).toBe(true)
  })

  it('returns false when no class matches', () => {
    const el = document.createElement('div')
    el.classList.add('foo', 'bar')
    expect(matchClass(el, /baz/)).toBe(false)
  })

  it('returns false for an element with no classes', () => {
    const el = document.createElement('div')
    expect(matchClass(el, /foo/)).toBe(false)
  })

  it('matches a partial class name', () => {
    const el = document.createElement('div')
    el.classList.add('my-component')
    expect(matchClass(el, /component/)).toBe(true)
  })

  it('respects regex flags', () => {
    const el = document.createElement('div')
    el.classList.add('FooBar')
    expect(matchClass(el, /foobar/i)).toBe(true)
    expect(matchClass(el, /foobar/)).toBe(false)
  })
})
