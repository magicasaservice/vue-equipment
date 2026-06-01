import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useMetaViewport } from './index'

beforeEach(() => {
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0')
  document.head.appendChild(meta)
})

afterEach(() => {
  document.querySelector('meta[name="viewport"]')?.remove()
})

describe('useMetaViewport', () => {
  describe('setMetaViewport()', () => {
    it('updates viewport content to the default value', () => {
      const { setMetaViewport } = useMetaViewport()
      setMetaViewport()
      const meta = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement
      expect(meta.content).toBe(
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      )
    })

    it('updates viewport content to a custom value', () => {
      const { setMetaViewport } = useMetaViewport({
        content: 'width=device-width',
      })
      setMetaViewport()
      const meta = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement
      expect(meta.content).toBe('width=device-width')
    })
  })

  describe('resetMetaViewport()', () => {
    it('restores the original viewport content', () => {
      const { setMetaViewport, resetMetaViewport } = useMetaViewport()
      setMetaViewport()
      resetMetaViewport()
      const meta = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement
      expect(meta.content).toBe('width=device-width, initial-scale=1.0')
    })

    it('does nothing if setMetaViewport was never called', () => {
      const { resetMetaViewport } = useMetaViewport()
      resetMetaViewport()
      const meta = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement
      expect(meta.content).toBe('width=device-width, initial-scale=1.0')
    })
  })
})
