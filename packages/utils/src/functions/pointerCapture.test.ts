import { describe, it, expect, vi } from 'vitest'
import {
  guardedSetPointerCapture,
  guardedReleasePointerCapture,
} from './pointerCapture'

describe('guardedSetPointerCapture', () => {
  function makeEl() {
    const el = document.createElement('div')
    const setPointerCapture = vi.fn()
    Object.defineProperty(el, 'setPointerCapture', {
      value: setPointerCapture,
      configurable: true,
    })
    return { el, setPointerCapture }
  }

  function makeEvent(overrides: Partial<PointerEvent> = {}): PointerEvent {
    return {
      pointerId: 1,
      isPrimary: true,
      pointerType: 'touch',
      ...overrides,
    } as PointerEvent
  }

  it('captures a primary touch pointer', () => {
    const { el, setPointerCapture } = makeEl()
    guardedSetPointerCapture({ event: makeEvent(), element: el })
    expect(setPointerCapture).toHaveBeenCalledWith(1)
  })

  it('does not capture a non-primary pointer', () => {
    const { el, setPointerCapture } = makeEl()
    guardedSetPointerCapture({
      event: makeEvent({ isPrimary: false }),
      element: el,
    })
    expect(setPointerCapture).not.toHaveBeenCalled()
  })

  it('does not capture a mouse pointer when mouse flag is not set', () => {
    const { el, setPointerCapture } = makeEl()
    guardedSetPointerCapture({
      event: makeEvent({ pointerType: 'mouse' }),
      element: el,
    })
    expect(setPointerCapture).not.toHaveBeenCalled()
  })

  it('captures a mouse pointer when mouse flag is true', () => {
    const { el, setPointerCapture } = makeEl()
    guardedSetPointerCapture({
      event: makeEvent({ pointerType: 'mouse' }),
      element: el,
      mouse: true,
    })
    expect(setPointerCapture).toHaveBeenCalledWith(1)
  })

  it('does nothing when element is null', () => {
    expect(() =>
      guardedSetPointerCapture({ event: makeEvent(), element: null })
    ).not.toThrow()
  })
})

describe('guardedReleasePointerCapture', () => {
  it('releases capture when the element holds it', () => {
    const el = document.createElement('div')
    el.hasPointerCapture = vi.fn().mockReturnValue(true)
    el.releasePointerCapture = vi.fn()

    const event = { pointerId: 1 } as PointerEvent
    guardedReleasePointerCapture({ event, element: el })

    expect(el.releasePointerCapture).toHaveBeenCalledWith(1)
  })

  it('does not release when the element does not hold capture', () => {
    const el = document.createElement('div')
    el.hasPointerCapture = vi.fn().mockReturnValue(false)
    el.releasePointerCapture = vi.fn()

    const event = { pointerId: 1 } as PointerEvent
    guardedReleasePointerCapture({ event, element: el })

    expect(el.releasePointerCapture).not.toHaveBeenCalled()
  })

  it('does nothing when element is null', () => {
    const event = { pointerId: 1 } as PointerEvent
    expect(() =>
      guardedReleasePointerCapture({ event, element: null })
    ).not.toThrow()
  })
})
