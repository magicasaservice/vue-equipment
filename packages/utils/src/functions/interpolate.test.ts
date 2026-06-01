import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { interpolate } from './interpolate'

const rafCallbacks = new Map<number, FrameRequestCallback>()
let rafId = 0

function tick(timestamp: number) {
  const pending = [...rafCallbacks.values()]
  rafCallbacks.clear()
  pending.forEach((fn) => fn(timestamp))
}

beforeEach(() => {
  rafCallbacks.clear()
  rafId = 0

  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    const id = ++rafId
    rafCallbacks.set(id, fn)
    return id
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('interpolate', () => {
  it('returns a requestAnimationFrame ID', () => {
    const id = interpolate({
      from: 0,
      to: 100,
      duration: 1000,
      callback: () => {},
    })
    expect(typeof id).toBe('number')
    expect(id).toBeGreaterThan(0)
  })

  it('calls callback with the from value on the first frame', () => {
    const callback = vi.fn()
    interpolate({ from: 10, to: 100, duration: 1000, callback })
    tick(0)
    expect(callback).toHaveBeenCalledWith(10)
  })

  it('calls callback with the to value when duration has elapsed', () => {
    const callback = vi.fn()
    interpolate({ from: 0, to: 100, duration: 1000, callback })
    tick(16)
    tick(1016)
    expect(callback).toHaveBeenLastCalledWith(100)
  })

  it('calls callback with an intermediate value mid-animation', () => {
    const callback = vi.fn()
    interpolate({
      from: 0,
      to: 100,
      duration: 1000,
      callback,
      easing: (t) => t,
    })
    tick(16)
    tick(516)
    expect(callback).toHaveBeenCalledWith(50)
  })

  it('uses a custom easing function', () => {
    const callback = vi.fn()
    const easing = vi.fn((t: number) => t)
    interpolate({ from: 0, to: 100, duration: 1000, callback, easing })
    tick(0)
    expect(easing).toHaveBeenCalled()
  })

  it('calls interpolationIdCallback with the next frame ID', () => {
    const interpolationIdCallback = vi.fn()
    interpolate({
      from: 0,
      to: 100,
      duration: 1000,
      callback: () => {},
      interpolationIdCallback,
    })
    tick(0)
    expect(interpolationIdCallback).toHaveBeenCalledWith(expect.any(Number))
  })

  it('stops scheduling frames once the animation completes', () => {
    const callback = vi.fn()
    interpolate({ from: 0, to: 100, duration: 1000, callback })
    tick(16)
    tick(1016)
    expect(rafCallbacks.size).toBe(0)
  })
})
