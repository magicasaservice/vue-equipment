import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'
import { createDraggable } from './test-utils'

describe('MagicDraggable - Options', () => {
  describe('disabled', () => {
    it('disabled option sets data-disabled to true', async () => {
      render(createDraggable('opt-disabled', { disabled: true }))
      await nextTick()

      const el = document.querySelector('[data-id="opt-disabled"]')
      expect(el!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('initial snapPoint', () => {
    it('starts at specified snap point', async () => {
      render(
        createDraggable('opt-initial', {
          initial: { snapPoint: 'center' },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector('[data-id="opt-initial"]')
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })

    it('defaults to top-left', async () => {
      render(createDraggable('opt-default-snap'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector('[data-id="opt-default-snap"]')
      expect(el!.getAttribute('data-active-snap-point')).toBe('top-left')
    })
  })

  describe('snapPoints', () => {
    it('custom snap points are accepted', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api = useMagicDraggable('opt-custom-snaps')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="snap" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">Center</button>
            <MagicDraggable id="opt-custom-snaps" :options="options">
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

      await screen.getByTestId('snap').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector(
        '[data-id="opt-custom-snaps"]'
      )
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')
    })
  })

  describe('tag option', () => {
    it('tag=div renders div element', async () => {
      render(createDraggable('opt-tag-div', { tag: 'div' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('div')
    })

    it('tag=dialog renders dialog element', async () => {
      render(createDraggable('opt-tag-dialog', { tag: 'dialog' }))
      await nextTick()

      const drag = document.querySelector('.magic-draggable__drag')
      expect(drag!.tagName.toLowerCase()).toBe('dialog')
    })
  })
})
