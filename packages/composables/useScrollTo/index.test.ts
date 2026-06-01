import { describe, it, expect, afterEach } from 'vitest'
import { useScrollTo } from './index'

const containers: HTMLElement[] = []

afterEach(() => {
  containers.forEach((el) => el.remove())
  containers.length = 0
})

function makeScrollable() {
  const el = document.createElement('div')
  containers.push(el)
  document.body.appendChild(el)
  return el
}

describe('useScrollTo', () => {
  describe('getScrollPosition()', () => {
    it('returns {x: 0, y: 0} for an element at rest', () => {
      const { getScrollPosition } = useScrollTo()
      expect(getScrollPosition(makeScrollable())).toEqual({ x: 0, y: 0 })
    })

    it('returns window scroll position for window', () => {
      const { getScrollPosition } = useScrollTo()
      expect(getScrollPosition(window as unknown as Element)).toEqual({
        x: 0,
        y: 0,
      })
    })
  })

  describe('getScrollDuration()', () => {
    it('returns zero duration when already at the target position', () => {
      const { getScrollDuration } = useScrollTo()
      expect(
        getScrollDuration({
          parent: makeScrollable(),
          left: 0,
          top: 0,
          speed: 500,
        })
      ).toEqual({ x: 0, y: 0 })
    })

    it('calculates duration proportional to distance', () => {
      const { getScrollDuration } = useScrollTo()
      const el = makeScrollable()
      const near = getScrollDuration({
        parent: el,
        left: 0,
        top: 100,
        speed: 500,
      })
      const far = getScrollDuration({
        parent: el,
        left: 0,
        top: 1000,
        speed: 500,
      })
      expect(far.y).toBeGreaterThan(near.y)
    })

    it('calculates lower duration for higher speed', () => {
      const { getScrollDuration } = useScrollTo()
      const el = makeScrollable()
      const slow = getScrollDuration({
        parent: el,
        left: 0,
        top: 500,
        speed: 100,
      })
      const fast = getScrollDuration({
        parent: el,
        left: 0,
        top: 500,
        speed: 1000,
      })
      expect(fast.y).toBeLessThan(slow.y)
    })
  })

  describe('scrollTo()', () => {
    it('fires the callback immediately when already at the target position', () => {
      const { scrollTo } = useScrollTo()
      const callback = vi.fn()
      scrollTo({ parent: makeScrollable(), top: 0, left: 0, callback })
      expect(callback).toHaveBeenCalledOnce()
    })
  })
})
