import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'
import { createDraggable } from './test-utils'
import { DraggableId, TestId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDraggable - Options', () => {
  describe('disabled', () => {
    it('disabled option sets data-disabled to true', async () => {
      render(createDraggable(DraggableId.OptDisabled, { disabled: true }))
      await nextTick()

      const el = document.querySelector(`[data-id="${DraggableId.OptDisabled}"]`)
      expect(el!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('initial snapPoint', () => {
    it('starts at specified snap point', async () => {
      render(
        createDraggable(DraggableId.Initial, {
          initial: { snapPoint: 'center' },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector(`[data-id="${DraggableId.Initial}"]`)
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })

    it('defaults to top-left when no initial snapPoint provided', async () => {
      render(createDraggable(DraggableId.DefaultSnap))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector(
        `[data-id="${DraggableId.DefaultSnap}"]`
      )
      expect(el!.getAttribute('data-active-snap-point')).toBe('top-left')
    })
  })

  describe('snapPoints', () => {
    it('can snapTo a custom snap point', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api = useMagicDraggable(DraggableId.CustomSnaps)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Snap}" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">Center</button>
            <MagicDraggable id="${DraggableId.CustomSnaps}" :options="options">
              <div style="width:50px;height:50px;">Box</div>
            </MagicDraggable>
          </div>
        `,
        data() {
          return {
            options: {
              snapPoints: ['top-left', 'center', 'bottom-right'],
              initial: { snapPoint: 'top-left' },
            },
          }
        },
      })

      const screen = render(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await screen.getByTestId(TestId.Snap).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector(`[data-id="${DraggableId.CustomSnaps}"]`)
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })
  })

  describe('tag option', () => {
    it('tag=div renders div element', async () => {
      render(createDraggable(DraggableId.OptTagDiv, { tag: 'div' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('div')
    })

    it('tag=dialog renders dialog element', async () => {
      render(createDraggable(DraggableId.OptTagDialog, { tag: 'dialog' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('dialog')
    })
  })
})
