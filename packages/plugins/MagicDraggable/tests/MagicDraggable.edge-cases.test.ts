import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'
import { createDraggable } from './test-utils'

describe('MagicDraggable - Edge Cases', () => {
  describe('multiple instances', () => {
    it('two draggables maintain independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api1 = useMagicDraggable('edge-multi-1')
          const api2 = useMagicDraggable('edge-multi-2')
          return { ...api1, snapTo2: api2.snapTo }
        },
        template: `
          <div>
            <button data-test-id="snap1" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">Snap 1</button>
            <MagicDraggable id="edge-multi-1" :options="options1">
              <div style="width:50px;height:50px;">A</div>
            </MagicDraggable>
            <MagicDraggable id="edge-multi-2" :options="options2">
              <div style="width:50px;height:50px;">B</div>
            </MagicDraggable>
          </div>
        `,
        data() {
          return {
            options1: { initial: { snapPoint: 'top-left' } },
            options2: { initial: { snapPoint: 'top-left' } },
          }
        },
      })

      const screen = render(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId('snap1').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el1 = document.querySelector('[data-id="edge-multi-1"]')
      const el2 = document.querySelector('[data-id="edge-multi-2"]')
      expect(el1!.getAttribute('data-active-snap-point')).toBe(
        'center'
      )
      expect(el2!.getAttribute('data-active-snap-point')).toBe(
        'top-left'
      )
    })
  })

  describe('snap point cycling', () => {
    it('can snap to different points in sequence', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api = useMagicDraggable('edge-cycle')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="tl" style="position:relative;z-index:10000"
              @click="snapTo('top-left', 0)">TL</button>
            <button data-test-id="br" style="position:relative;z-index:10000"
              @click="snapTo('bottom-right', 0)">BR</button>
            <button data-test-id="c" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">C</button>
            <MagicDraggable id="edge-cycle" :options="options">
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
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector('[data-id="edge-cycle"]')

      await screen.getByTestId('br').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe(
        'bottom-right'
      )

      await screen.getByTestId('c').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')

      await screen.getByTestId('tl').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe(
        'top-left'
      )
    })
  })

  describe('overlay', () => {
    it('overlay is not present when not dragged', async () => {
      render(createDraggable('edge-overlay'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector(
        '.magic-draggable__overlay'
      )
      expect(overlay).toBeNull()
    })
  })

  describe('transform', () => {
    it('drag element has translate3d transform', async () => {
      render(createDraggable('edge-transform'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const drag = document.querySelector(
        '.magic-draggable__drag'
      ) as HTMLElement
      expect(drag.style.transform).toContain('translate3d')
    })
  })
})
