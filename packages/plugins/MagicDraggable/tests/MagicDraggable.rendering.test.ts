import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDraggable } from './test-utils'

describe('MagicDraggable - Rendering', () => {
  describe('container', () => {
    it('renders with correct class', async () => {
      render(createDraggable('render-class'))
      await nextTick()

      expect(document.querySelector('.magic-draggable')).not.toBeNull()
    })

    it('sets data-id attribute', async () => {
      render(createDraggable('render-data-id'))
      await nextTick()

      const el = document.querySelector('.magic-draggable')
      expect(el!.getAttribute('data-id')).toBe('render-data-id')
    })

    it('renders slot content with correct text', async () => {
      render(createDraggable('render-slot'))
      await nextTick()

      const inner = document.querySelector('.inner-content')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Content')
    })
  })

  describe('structure', () => {
    it('renders wrapper element', async () => {
      render(createDraggable('render-wrapper'))
      await nextTick()

      expect(
        document.querySelector('.magic-draggable__wrapper')
      ).not.toBeNull()
    })

    it('renders drag container', async () => {
      render(createDraggable('render-drag'))
      await nextTick()

      expect(
        document.querySelector('.magic-draggable__drag')
      ).not.toBeNull()
    })

    it('renders as div by default', async () => {
      render(createDraggable('render-tag-div'))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('div')
    })

    it('renders as dialog when tag=dialog', async () => {
      render(createDraggable('render-tag-dialog', { tag: 'dialog' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('dialog')
    })
  })

  describe('data attributes', () => {
    it('data-dragging is false initially', async () => {
      render(createDraggable('render-dragging'))
      await nextTick()

      const el = document.querySelector('[data-id="render-dragging"]')
      expect(el!.getAttribute('data-dragging')).toBe('false')
    })

    it('data-disabled is false by default', async () => {
      render(createDraggable('render-not-disabled'))
      await nextTick()

      const el = document.querySelector(
        '[data-id="render-not-disabled"]'
      )
      expect(el!.getAttribute('data-disabled')).toBe('false')
    })

    it('data-disabled is true when disabled option set', async () => {
      render(createDraggable('render-disabled', { disabled: true }))
      await nextTick()

      const el = document.querySelector('[data-id="render-disabled"]')
      expect(el!.getAttribute('data-disabled')).toBe('true')
    })

    it('data-active-snap-point reflects initial snap point', async () => {
      render(
        createDraggable('render-snap', {
          initial: { snapPoint: 'center' },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector('[data-id="render-snap"]')
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })
  })
})
