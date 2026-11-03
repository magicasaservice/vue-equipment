import { describe, it, expect, afterEach } from 'vitest'
import { effectScope, ref } from 'vue'
import { useTouchIntent } from './index'

import type { EffectScope } from 'vue'

const scopes: Array<EffectScope> = []
const elements: Array<HTMLElement> = []

afterEach(() => {
  scopes.forEach((scope) => scope.stop())
  scopes.length = 0
  elements.forEach((element) => element.remove())
  elements.length = 0
})

function setup(options: Parameters<typeof useTouchIntent>[0] = {}) {
  const element = document.createElement('div')
  document.body.appendChild(element)
  elements.push(element)
  const scope = effectScope()
  scopes.push(scope)
  const result = scope.run(() =>
    useTouchIntent({ target: element, ...options })
  )!

  return { element, ...result }
}

function pointer(target: EventTarget, type: string, x: number, y: number) {
  target.dispatchEvent(
    new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })
  )
}

describe('useTouchIntent', () => {
  it('reads a move up or down past the threshold as a scroll until the press ends', () => {
    const { element, intent, isScrolling, isSwiping } = setup()

    pointer(element, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 11, 22)
    expect(intent.value).toBe('scroll')
    expect(isScrolling.value).toBe(true)
    expect(isSwiping.value).toBe(false)

    pointer(document, 'pointermove', 40, 24)
    expect(intent.value).toBe('scroll')

    pointer(document, 'pointerup', 40, 24)
    expect(intent.value).toBeUndefined()
    expect(isScrolling.value).toBe(false)
  })

  it('reads a sideways move past the threshold as a swipe until the press ends', () => {
    const { element, intent, isScrolling, isSwiping } = setup()

    pointer(element, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 22, 12)
    expect(intent.value).toBe('swipe')
    expect(isSwiping.value).toBe(true)
    expect(isScrolling.value).toBe(false)

    pointer(document, 'pointermove', 24, 60)
    expect(intent.value).toBe('swipe')

    pointer(document, 'pointercancel', 24, 60)
    expect(intent.value).toBeUndefined()
    expect(isSwiping.value).toBe(false)
  })

  it('waits while a move stays short of the threshold', () => {
    const { element, intent } = setup()

    pointer(element, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 10, 15)
    expect(intent.value).toBeUndefined()

    pointer(document, 'pointermove', 10, 30)
    expect(intent.value).toBe('scroll')

    pointer(document, 'pointerup', 10, 30)
  })

  it('swaps the intents on a horizontal axis and reads the threshold as a ref', () => {
    const threshold = ref(20)
    const { element, intent } = setup({ axis: 'x', threshold })

    pointer(element, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 25, 12)
    expect(intent.value).toBeUndefined()

    pointer(document, 'pointermove', 40, 12)
    expect(intent.value).toBe('scroll')

    pointer(document, 'pointerup', 40, 12)

    pointer(element, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 12, 40)
    expect(intent.value).toBe('swipe')

    pointer(document, 'pointerup', 12, 40)
  })

  it('ignores presses outside the target', () => {
    const { intent } = setup()

    pointer(document.body, 'pointerdown', 10, 10)
    pointer(document, 'pointermove', 10, 40)
    expect(intent.value).toBeUndefined()
  })
})
