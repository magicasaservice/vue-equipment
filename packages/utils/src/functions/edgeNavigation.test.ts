import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cancelEdgeNavigation,
  hasEdgeNavigationGestures,
} from './edgeNavigation'

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
const IPADOS_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6)'
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'

interface FakeTouchEventArgs {
  target?: EventTarget
  touches?: Array<Partial<Touch>>
  cancelable?: boolean
}

function fakeTouchEvent(args: FakeTouchEventArgs = {}): TouchEvent {
  const {
    target = document.createElement('div'),
    touches = [{ identifier: 0, clientX: 10, clientY: 100 }],
    cancelable = true,
  } = args

  return {
    target,
    touches,
    cancelable,
    preventDefault: vi.fn(),
  } as unknown as TouchEvent
}

function dispatchFakeTouch(
  type: 'touchend' | 'touchcancel',
  changedTouches: Array<Partial<Touch>>
) {
  const event = new Event(type)
  Object.defineProperty(event, 'changedTouches', { value: changedTouches })
  document.dispatchEvent(event)
}

beforeEach(() => {
  vi.stubGlobal('navigator', { userAgent: IPHONE_UA, maxTouchPoints: 5 })
  vi.useFakeTimers()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('hasEdgeNavigationGestures', () => {
  it('returns true for an iPhone user agent', () => {
    expect(hasEdgeNavigationGestures()).toBe(true)
  })

  it('returns true for the iPadOS Macintosh user agent with touch support', () => {
    vi.stubGlobal('navigator', { userAgent: IPADOS_UA, maxTouchPoints: 5 })
    expect(hasEdgeNavigationGestures()).toBe(true)
  })

  it('returns false for a Macintosh user agent without touch support', () => {
    vi.stubGlobal('navigator', { userAgent: IPADOS_UA, maxTouchPoints: 0 })
    expect(hasEdgeNavigationGestures()).toBe(false)
  })

  it('returns false for an Android user agent', () => {
    vi.stubGlobal('navigator', { userAgent: ANDROID_UA, maxTouchPoints: 5 })
    expect(hasEdgeNavigationGestures()).toBe(false)
  })

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(hasEdgeNavigationGestures()).toBe(false)
  })
})

describe('cancelEdgeNavigation', () => {
  it('cancels a touch near the left viewport edge', () => {
    const event = fakeTouchEvent()
    expect(cancelEdgeNavigation({ event })).toBe(true)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('cancels a touch near the right viewport edge', () => {
    const event = fakeTouchEvent({
      touches: [{ identifier: 0, clientX: window.innerWidth - 10 }],
    })
    expect(cancelEdgeNavigation({ event })).toBe(true)
  })

  it('ignores a touch away from both edges', () => {
    const event = fakeTouchEvent({
      touches: [{ identifier: 0, clientX: window.innerWidth / 2 }],
    })
    expect(cancelEdgeNavigation({ event })).toBe(false)
    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('respects a custom threshold', () => {
    const event = fakeTouchEvent({
      touches: [{ identifier: 0, clientX: 100 }],
    })
    expect(cancelEdgeNavigation({ event, threshold: 120 })).toBe(true)
  })

  it('ignores multi-touch events', () => {
    const event = fakeTouchEvent({
      touches: [
        { identifier: 0, clientX: 10 },
        { identifier: 1, clientX: 20 },
      ],
    })
    expect(cancelEdgeNavigation({ event })).toBe(false)
  })

  it('ignores touches on focus-driven controls', () => {
    const event = fakeTouchEvent({ target: document.createElement('select') })
    expect(cancelEdgeNavigation({ event })).toBe(false)
  })

  it('respects custom excluded tags regardless of casing', () => {
    const event = fakeTouchEvent({ target: document.createElement('button') })
    expect(cancelEdgeNavigation({ event, exclude: ['button'] })).toBe(false)
  })

  it('cancels touches on focus-driven controls when excluded tags are overridden', () => {
    const event = fakeTouchEvent({ target: document.createElement('select') })
    expect(cancelEdgeNavigation({ event, exclude: [] })).toBe(true)
  })

  it('ignores every touch on platforms without edge navigation gestures', () => {
    vi.stubGlobal('navigator', { userAgent: ANDROID_UA, maxTouchPoints: 5 })
    const event = fakeTouchEvent()
    expect(cancelEdgeNavigation({ event })).toBe(false)
  })

  it('restores the click for a touch that ends within the slop', () => {
    const target = document.createElement('button')
    const onClick = vi.fn()
    target.addEventListener('click', onClick)

    const event = fakeTouchEvent({ target })
    cancelEdgeNavigation({ event })

    dispatchFakeTouch('touchend', [{ identifier: 0, clientX: 14, clientY: 96 }])
    vi.runAllTimers()

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not restore the click for a touch that traveled beyond the slop', () => {
    const target = document.createElement('button')
    const onClick = vi.fn()
    target.addEventListener('click', onClick)

    const event = fakeTouchEvent({ target })
    cancelEdgeNavigation({ event })

    dispatchFakeTouch('touchend', [
      { identifier: 0, clientX: 80, clientY: 100 },
    ])
    vi.runAllTimers()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not restore the click for a canceled touch', () => {
    const target = document.createElement('button')
    const onClick = vi.fn()
    target.addEventListener('click', onClick)

    const event = fakeTouchEvent({ target })
    cancelEdgeNavigation({ event })

    dispatchFakeTouch('touchcancel', [{ identifier: 0 }])
    dispatchFakeTouch('touchend', [
      { identifier: 0, clientX: 10, clientY: 100 },
    ])
    vi.runAllTimers()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('ignores touchends of other touches', () => {
    const target = document.createElement('button')
    const onClick = vi.fn()
    target.addEventListener('click', onClick)

    const event = fakeTouchEvent({ target })
    cancelEdgeNavigation({ event })

    dispatchFakeTouch('touchend', [
      { identifier: 1, clientX: 10, clientY: 100 },
    ])
    dispatchFakeTouch('touchend', [
      { identifier: 0, clientX: 10, clientY: 100 },
    ])
    vi.runAllTimers()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
