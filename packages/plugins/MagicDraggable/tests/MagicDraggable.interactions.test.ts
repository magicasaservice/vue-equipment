import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDraggable } from './test-utils'
import { DraggableId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDraggable - Interactions', () => {
  describe('pointer events', () => {
    it('pointerdown sets data-dragging to true', async () => {
      render(createDraggable(DraggableId.PDown))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const drag = document.querySelector(
        '.magic-draggable__drag'
      ) as HTMLElement
      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: 25,
          clientY: 25,
          pointerId: 1,
        })
      )
      await nextTick()

      const el = document.querySelector(`[data-id="${DraggableId.PDown}"]`)
      expect(el!.getAttribute('data-dragging')).toBe('true')

      document.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      )
    })

    it('pointermove updates transform with translate3d', async () => {
      render(createDraggable(DraggableId.Move, { threshold: { lock: 0 } }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const drag = document.querySelector(
        '.magic-draggable__drag'
      ) as HTMLElement

      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: 25,
          clientY: 25,
          pointerId: 1,
        })
      )
      await nextTick()

      document.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: 75,
          clientY: 75,
          pointerId: 1,
        })
      )
      await nextTick()

      expect(drag.style.transform).toContain('translate3d')

      document.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      )
    })
  })

  describe('disabled state', () => {
    it('disabled draggable ignores pointer events — transform unchanged', async () => {
      render(createDraggable(DraggableId.IntDisabled, { disabled: true }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const drag = document.querySelector(
        '.magic-draggable__drag'
      ) as HTMLElement
      const transformBefore = drag.style.transform

      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: 25,
          clientY: 25,
          pointerId: 1,
        })
      )
      await nextTick()

      document.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: 100,
          clientY: 100,
          pointerId: 1,
        })
      )
      await nextTick()

      expect(drag.style.transform).toBe(transformBefore)

      document.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      )
    })
  })
})
