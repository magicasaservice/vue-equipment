import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDraggable } from './test-utils'
import { DraggableId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDraggable - Rendering', () => {
  describe('container', () => {
    it('sets data-id attribute from id prop', async () => {
      render(createDraggable(DraggableId.DataId))
      await nextTick()

      const el = document.querySelector('.magic-draggable')
      expect(el!.getAttribute('data-id')).toBe(DraggableId.DataId)
    })

    it('renders slot content', async () => {
      render(createDraggable(DraggableId.RenderSlot))
      await nextTick()

      const inner = document.querySelector('.inner-content')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Content')
    })
  })

  describe('structure', () => {
    it('renders as div by default', async () => {
      render(createDraggable(DraggableId.RenderTagDiv))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('div')
    })

    it('renders as dialog when tag=dialog', async () => {
      render(createDraggable(DraggableId.RenderTagDialog, { tag: 'dialog' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('dialog')
    })
  })

  describe('data attributes', () => {
    it('data-dragging is false initially', async () => {
      render(createDraggable(DraggableId.Dragging))
      await nextTick()

      const el = document.querySelector(
        `[data-id="${DraggableId.Dragging}"]`
      )
      expect(el!.getAttribute('data-dragging')).toBe('false')
    })

    it('data-disabled is false by default', async () => {
      render(createDraggable(DraggableId.NotDisabled))
      await nextTick()

      const el = document.querySelector(
        `[data-id="${DraggableId.NotDisabled}"]`
      )
      expect(el!.getAttribute('data-disabled')).toBe('false')
    })

    it('data-disabled is true when disabled option set', async () => {
      render(createDraggable(DraggableId.RenderDisabled, { disabled: true }))
      await nextTick()

      const el = document.querySelector(
        `[data-id="${DraggableId.RenderDisabled}"]`
      )
      expect(el!.getAttribute('data-disabled')).toBe('true')
    })

    it('data-active-snap-point reflects initial snap point', async () => {
      render(
        createDraggable(DraggableId.RenderSnap, {
          initial: { snapPoint: 'center' },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector(`[data-id="${DraggableId.RenderSnap}"]`)
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })
  })
})
