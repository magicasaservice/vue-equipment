import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'

function createDraggableWithSnap(
  draggableId: string,
  snapTarget: string,
  duration: number = 0,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDraggable },
    setup() {
      const api = useMagicDraggable(draggableId)
      return { ...api }
    },
    template: `
      <div>
        <button data-test-id="snap" style="position:relative;z-index:10000"
          @click="snapTo('${snapTarget}', ${duration})">Snap</button>
        <MagicDraggable id="${draggableId}" :options="options">
          <div style="width:50px;height:50px;">Box</div>
        </MagicDraggable>
      </div>
    `,
    data() {
      return {
        options: {
          initial: { snapPoint: 'top-left' },
          ...options,
        },
      }
    },
  })
}

describe('MagicDraggable - API', () => {
  describe('composable return shape', () => {
    it('returns snapTo function', () => {
      let api: ReturnType<typeof useMagicDraggable> | undefined

      render(
        defineComponent({
          setup() {
            api = useMagicDraggable('api-shape')
            return {}
          },
          template: '<div>test</div>',
        })
      )

      expect(typeof api!.snapTo).toBe('function')
    })
  })

  describe('snapTo', () => {
    it('changes active snap point immediately with duration 0', async () => {
      const screen = render(
        createDraggableWithSnap('api-snap', 'bottom-right', 0)
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector('[data-id="api-snap"]')
      expect(el!.getAttribute('data-active-snap-point')).toBe(
        'top-left'
      )

      await screen.getByTestId('snap').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(el!.getAttribute('data-active-snap-point')).toBe(
        'bottom-right'
      )
    })

    it('changes active snap point after animated duration', async () => {
      const screen = render(
        createDraggableWithSnap('api-snap-anim', 'bottom-right', 200)
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId('snap').click()
      await new Promise((r) => setTimeout(r, 300))

      const el = document.querySelector('[data-id="api-snap-anim"]')
      expect(el!.getAttribute('data-active-snap-point')).toBe(
        'bottom-right'
      )
    })
  })
})
