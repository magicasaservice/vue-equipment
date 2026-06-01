import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'
import { createDraggable } from './test-utils'
import { DraggableId, TestId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDraggable - Edge Cases', () => {
  describe('multiple instances', () => {
    it('two draggables maintain independent snap state', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api1 = useMagicDraggable(DraggableId.Multi1)
          const api2 = useMagicDraggable(DraggableId.Multi2)
          return { ...api1, snapTo2: api2.snapTo }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Snap1}" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">Snap 1</button>
            <MagicDraggable id="${DraggableId.Multi1}" :options="options1">
              <div style="width:50px;height:50px;">A</div>
            </MagicDraggable>
            <MagicDraggable id="${DraggableId.Multi2}" :options="options2">
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

      await screen.getByTestId(TestId.Snap1).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el1 = document.querySelector(`[data-id="${DraggableId.Multi1}"]`)
      const el2 = document.querySelector(`[data-id="${DraggableId.Multi2}"]`)
      expect(el1!.getAttribute('data-active-snap-point')).toBe('center')
      expect(el2!.getAttribute('data-active-snap-point')).toBe('top-left')
    })
  })

  describe('snap point cycling', () => {
    it('can snap through multiple points in sequence', async () => {
      const wrapper = defineComponent({
        components: { MagicDraggable },
        setup() {
          const api = useMagicDraggable(DraggableId.Cycle)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Tl}" style="position:relative;z-index:10000"
              @click="snapTo('top-left', 0)">TL</button>
            <button data-test-id="${TestId.Br}" style="position:relative;z-index:10000"
              @click="snapTo('bottom-right', 0)">BR</button>
            <button data-test-id="${TestId.C}" style="position:relative;z-index:10000"
              @click="snapTo('center', 0)">C</button>
            <MagicDraggable id="${DraggableId.Cycle}" :options="options">
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

      const el = document.querySelector(`[data-id="${DraggableId.Cycle}"]`)

      await screen.getByTestId(TestId.Br).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe('bottom-right')

      await screen.getByTestId(TestId.C).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe('center')

      await screen.getByTestId(TestId.Tl).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      expect(el!.getAttribute('data-active-snap-point')).toBe('top-left')
    })
  })

  describe('overlay', () => {
    it('overlay element absent when not dragging', async () => {
      render(createDraggable(DraggableId.Overlay))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-draggable__overlay')).toBeNull()
    })
  })

  describe('transform', () => {
    it('drag element uses translate3d transform', async () => {
      render(createDraggable(DraggableId.Transform))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const drag = document.querySelector(
        '.magic-draggable__drag'
      ) as HTMLElement
      expect(drag.style.transform).toContain('translate3d')
    })
  })
})
