import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('converts to a lowercase hyphen-separated slug by default', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('collapses multiple spaces into one separator', () => {
    expect(slugify('foo  bar  baz')).toBe('foo-bar-baz')
  })

  it('removes special characters in strict mode', () => {
    expect(slugify('hello! world?')).toBe('hello-world')
  })

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('uses a custom separator', () => {
    expect(slugify('hello world', { separator: '_' })).toBe('hello_world')
  })

  it('preserves case when lowercase is false', () => {
    expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World')
  })

  it('allows special characters when strict is false', () => {
    expect(slugify('hello.world', { strict: false })).toBe('hello.world')
  })

  it('skips trimming when trim is false', () => {
    expect(slugify('  hello  ', { trim: false, separator: '-' })).toBe(
      '-hello-'
    )
  })

  it('applies a custom remove regex', () => {
    expect(slugify('hello@world', { remove: /@/g, strict: false })).toBe(
      'helloworld'
    )
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('throws for non-string input', () => {
    expect(() => slugify(123 as unknown as string)).toThrow(
      'slugify: string argument expected'
    )
  })
})
