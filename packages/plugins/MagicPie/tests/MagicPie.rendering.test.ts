import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createPie } from './test-utils'

describe('MagicPie - Rendering', () => {
  describe('container', () => {
    it('renders with correct class', async () => {
      render(createPie('render-class'))
      await nextTick()

      expect(document.querySelector('.magic-pie')).not.toBeNull()
    })

    it('sets data-id attribute', async () => {
      render(createPie('render-data-id'))
      await nextTick()

      const el = document.querySelector('.magic-pie')
      expect(el!.getAttribute('data-id')).toBe('render-data-id')
    })
  })

  describe('SVG structure', () => {
    it('renders SVG with viewBox 0 0 100 100', async () => {
      render(createPie('render-svg'))
      await nextTick()

      const svg = document.querySelector('#magic-pie__svg')
      expect(svg).not.toBeNull()
      expect(svg!.getAttribute('viewBox')).toBe('0 0 100 100')
    })

    it('renders mask element with correct id', async () => {
      render(createPie('render-mask'))
      await nextTick()

      expect(document.querySelector('#magic-pie__mask')).not.toBeNull()
    })

    it('renders path with d attribute', async () => {
      render(createPie('render-path'))
      await nextTick()

      const path = document.querySelector('.magic-pie path')
      expect(path).not.toBeNull()
      expect(path!.getAttribute('d')).toBeTruthy()
    })
  })

  describe('flip attribute', () => {
    it('data-flip is null by default', async () => {
      render(createPie('render-no-flip'))
      await nextTick()

      const el = document.querySelector('.magic-pie')
      expect(el!.getAttribute('data-flip')).toBeNull()
    })

    it('data-flip is true when flip option set', async () => {
      render(createPie('render-flip', { flip: true }))
      await nextTick()

      const el = document.querySelector('.magic-pie')
      expect(el!.getAttribute('data-flip')).toBe('true')
    })
  })
})
