import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'
import { useMagicEmitter } from '../../MagicEmitter/src/composables/useMagicEmitter'
import { DraggableId, TestId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDraggable - Events', () => {
  describe('snap events', () => {
    it('snapTo emits snapTo event with correct payload', async () => {
      const handler = vi.fn()

      const screen = render(
        defineComponent({
          components: { MagicDraggable },
          setup() {
            const api = useMagicDraggable(DraggableId.SnapPayload)
            const emitter = useMagicEmitter()
            emitter.on('snapTo', handler)
            return { api }
          },
          template: `
            <div>
              <button data-test-id="${TestId.Snap}" style="position:relative;z-index:10000"
                @click="api.snapTo('bottom-right', 10)">Snap</button>
              <MagicDraggable id="${DraggableId.SnapPayload}" :options="{ initial: { snapPoint: 'top-left' } }">
                <div style="width:50px;height:50px;">Box</div>
              </MagicDraggable>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Snap).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(handler).toHaveBeenCalled()
      const payload = handler.mock.calls[0]![0]
      expect(payload.id).toBe(DraggableId.SnapPayload)
      expect(payload.snapPoint).toBe('bottom-right')
      expect(payload.duration).toBe(10)
    })

    it('beforeSnap fires with correct payload', async () => {
      const handler = vi.fn()

      const screen = render(
        defineComponent({
          components: { MagicDraggable },
          setup() {
            const api = useMagicDraggable(DraggableId.BeforeSnap)
            const emitter = useMagicEmitter()
            emitter.on('beforeSnap', handler)
            return { api }
          },
          template: `
            <div>
              <button data-test-id="${TestId.Snap}" style="position:relative;z-index:10000"
                @click="api.snapTo('bottom-right', 0)">Snap</button>
              <MagicDraggable id="${DraggableId.BeforeSnap}" :options="{ initial: { snapPoint: 'top-left' } }">
                <div style="width:50px;height:50px;">Box</div>
              </MagicDraggable>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Snap).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      expect(handler).toHaveBeenCalled()
      const payload = handler.mock.calls[0]![0]
      expect(payload.id).toBe(DraggableId.BeforeSnap)
      expect(payload.snapPoint).toBe('bottom-right')
    })

    it('afterSnap fires with correct payload', async () => {
      const handler = vi.fn()

      const screen = render(
        defineComponent({
          components: { MagicDraggable },
          setup() {
            const api = useMagicDraggable(DraggableId.AfterSnap)
            const emitter = useMagicEmitter()
            emitter.on('afterSnap', handler)
            return { api }
          },
          template: `
            <div>
              <button data-test-id="${TestId.Snap}" style="position:relative;z-index:10000"
                @click="api.snapTo('bottom-right', 10)">Snap</button>
              <MagicDraggable id="${DraggableId.AfterSnap}" :options="{ initial: { snapPoint: 'top-left' } }">
                <div style="width:50px;height:50px;">Box</div>
              </MagicDraggable>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Snap).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      expect(handler).toHaveBeenCalled()
      const payload = handler.mock.calls[0]![0]
      expect(payload.id).toBe(DraggableId.AfterSnap)
      expect(payload.snapPoint).toBe('bottom-right')
    })
  })

  describe('drag events', () => {
    it('pointerdown emits beforeDrag with id and coordinates', async () => {
      const handler = vi.fn()

      render(
        defineComponent({
          components: { MagicDraggable },
          setup() {
            const emitter = useMagicEmitter()
            emitter.on('beforeDrag', handler)
            return {}
          },
          template: `
            <MagicDraggable id="${DraggableId.DragPayload}">
              <div style="width:50px;height:50px;">Box</div>
            </MagicDraggable>
          `,
        })
      )
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
      await new Promise((r) => setTimeout(r, 50))

      expect(handler).toHaveBeenCalled()
      const payload = handler.mock.calls[0]![0]
      expect(payload.id).toBe(DraggableId.DragPayload)
      expect(typeof payload.x).toBe('number')
      expect(typeof payload.y).toBe('number')

      document.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      )
    })
  })

  describe('snap with offset', () => {
    it('snapTo with tuple offset format fires afterSnap', async () => {
      const handler = vi.fn()

      const screen = render(
        defineComponent({
          components: { MagicDraggable },
          setup() {
            const api = useMagicDraggable(DraggableId.Offset)
            const emitter = useMagicEmitter()
            emitter.on('afterSnap', handler)
            return { api }
          },
          template: `
            <div>
              <button data-test-id="${TestId.Snap}" style="position:relative;z-index:10000"
                @click="api.snapTo(['center', { x: 10, y: 20 }], 10)">Snap</button>
              <MagicDraggable id="${DraggableId.Offset}" :options="{
                snapPoints: [['center', { x: 10, y: 20 }], 'top-left'],
                initial: { snapPoint: 'top-left' }
              }">
                <div style="width:50px;height:50px;">Box</div>
              </MagicDraggable>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Snap).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      expect(handler).toHaveBeenCalled()
    })
  })
})
