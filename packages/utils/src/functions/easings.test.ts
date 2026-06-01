import { describe, it, expect } from 'vitest'
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeOutBack,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
} from './easings'

const easingFunctions = [
  ['linear', linear],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeOutBack', easeOutBack],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInQuint', easeInQuint],
  ['easeOutQuint', easeOutQuint],
  ['easeInOutQuint', easeInOutQuint],
] as const

describe('easings - boundary values', () => {
  it.each(easingFunctions)('%s returns 0 at t=0', (_, fn) => {
    expect(fn(0)).toBeCloseTo(0)
  })

  it.each(easingFunctions)('%s returns 1 at t=1', (_, fn) => {
    expect(fn(1)).toBeCloseTo(1)
  })
})

describe('easings - curve characteristics', () => {
  it('linear returns t unchanged at any point', () => {
    expect(linear(0.25)).toBe(0.25)
    expect(linear(0.5)).toBe(0.5)
    expect(linear(0.75)).toBe(0.75)
  })

  it.each([
    ['easeInQuad', easeInQuad],
    ['easeInCubic', easeInCubic],
    ['easeInQuart', easeInQuart],
    ['easeInQuint', easeInQuint],
  ] as const)('%s is slower than linear at midpoint', (_, fn) => {
    expect(fn(0.5)).toBeLessThan(0.5)
  })

  it.each([
    ['easeOutQuad', easeOutQuad],
    ['easeOutCubic', easeOutCubic],
    ['easeOutQuart', easeOutQuart],
    ['easeOutQuint', easeOutQuint],
  ] as const)('%s is faster than linear at midpoint', (_, fn) => {
    expect(fn(0.5)).toBeGreaterThan(0.5)
  })

  it.each([
    ['easeInOutQuad', easeInOutQuad],
    ['easeInOutCubic', easeInOutCubic],
    ['easeInOutQuart', easeInOutQuart],
    ['easeInOutQuint', easeInOutQuint],
  ] as const)('%s is symmetric at midpoint', (_, fn) => {
    expect(fn(0.5)).toBeCloseTo(0.5)
  })

  it('easeInCubic is slower than easeInQuad at midpoint', () => {
    expect(easeInCubic(0.5)).toBeLessThan(easeInQuad(0.5))
  })

  it('easeInQuart is slower than easeInCubic at midpoint', () => {
    expect(easeInQuart(0.5)).toBeLessThan(easeInCubic(0.5))
  })

  it('easeInQuint is slower than easeInQuart at midpoint', () => {
    expect(easeInQuint(0.5)).toBeLessThan(easeInQuart(0.5))
  })

  it('easeOutBack overshoots past 1 before reaching the end', () => {
    expect(easeOutBack(0.8)).toBeGreaterThan(1)
  })
})
