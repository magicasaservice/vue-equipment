import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useScrollLockPadding } from './index'

beforeEach(() => {
  vi.stubGlobal('CSS', { supports: () => false })
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.style.removeProperty('--scrollbar-width')
  document.body.style.paddingRight = ''
  document.documentElement.style.scrollbarGutter = ''
})

describe('useScrollLockPadding', () => {
  describe('add()', () => {
    it('sets --scrollbar-width on body', () => {
      const { add } = useScrollLockPadding()
      add()
      expect(document.body.style.getPropertyValue('--scrollbar-width')).toMatch(
        /^\d+px$/
      )
    })

    it('applies padding compensation to fixed-position elements aligned to the right edge', () => {
      const fixed = document.createElement('div')
      Object.defineProperty(fixed, 'style', {
        value: {
          position: 'fixed',
          right: '0px',
          paddingRight: '',
          scrollbarGutter: '',
          overflow: '',
        },
        writable: true,
      })
      vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
        if (el === fixed) {
          return {
            getPropertyValue: (p: string) =>
              p === 'position' ? 'fixed' : p === 'right' ? '0px' : '',
          } as CSSStyleDeclaration
        }
        return window.getComputedStyle(el)
      })
      document.body.appendChild(fixed)

      const { add, remove } = useScrollLockPadding()
      add()
      remove()

      fixed.remove()
      vi.restoreAllMocks()
    })

    it('skips elements matching the exclude regex', () => {
      const { add } = useScrollLockPadding({ exclude: /excluded/ })
      add()
      expect(document.body.style.getPropertyValue('--scrollbar-width')).toMatch(
        /^\d+px$/
      )
    })
  })

  describe('remove()', () => {
    it('clears --scrollbar-width from body', () => {
      const { add, remove } = useScrollLockPadding()
      add()
      remove()
      expect(document.body.style.getPropertyValue('--scrollbar-width')).toBe('')
    })

    it('clears paddingRight from body', () => {
      const { add, remove } = useScrollLockPadding()
      add()
      remove()
      expect(document.body.style.paddingRight).toBe('')
    })
  })
})
