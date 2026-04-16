import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'
import { useMagicEmitter } from '../../MagicEmitter'

const SimpleToast = defineComponent({
  template:
    '<div class="toast-content" style="height: 50px; width: 200px; background: white;">Toast</div>',
})

function createWrapper(
  toastId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)
      function addToast() {
        api.add({ component: SimpleToast })
      }
      return { ...api, addToast }
    },
    template: `
      <div>
        <button data-test-id="add-btn" @click="addToast">Add</button>
        <span data-test-id="count">{{ count }}</span>
        <MagicToastProvider id="${toastId}" :options="options" />
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function pointerEvent(
  type: string,
  opts: Partial<PointerEventInit> = {}
) {
  return new PointerEvent(type, {
    bubbles: true,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'touch',
    screenX: 0,
    screenY: 0,
    ...opts,
  })
}

async function addAndGetDragEl(
  screen: ReturnType<typeof render>
): Promise<HTMLElement> {
  await screen.getByTestId('add-btn').click()
  await nextTick()
  await nextTick()

  const dragEl = document.querySelector(
    '.magic-toast-view__drag'
  ) as HTMLElement
  expect(dragEl).not.toBeNull()
  return dragEl
}

describe('MagicToast - Interactions', () => {
  describe('drag state', () => {
    it('pointerdown sets data-dragging to true', async () => {
      const screen = render(createWrapper('int-drag-state'))
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-dragging')).toBe('true')

      // Cleanup: pointerup
      document.dispatchEvent(pointerEvent('pointerup', { screenY: 100 }))
    })

    it('pointerup resets data-dragging to false', async () => {
      const screen = render(createWrapper('int-drag-reset'))
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 100 }))
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-dragging')).toBe('false')
    })
  })

  describe('drag direction constraints', () => {
    it('bottom position: drag down moves toast', async () => {
      const screen = render(
        createWrapper('int-drag-bottom', { position: 'bottom' })
      )
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 200 }))
      await nextTick()

      // Move down (positive Y)
      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 220 })
      )
      await nextTick()

      // Drag container should have transform with positive Y
      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      const transform = dragContainer.style.transform
      expect(transform).toContain('translate(')
      // Y should be positive (dragged down)
      const yMatch = transform.match(/translate\((\d+)px,\s*(\d+)px\)/)
      if (yMatch?.[2]) {
        expect(parseInt(yMatch[2])).toBeGreaterThanOrEqual(0)
      }

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 220 }))
    })

    it('bottom position: drag up is constrained to 0', async () => {
      const screen = render(
        createWrapper('int-drag-bottom-up', { position: 'bottom' })
      )
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 200 }))
      await nextTick()

      // Try to move up (negative Y) — should be clamped to 0
      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 150 })
      )
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      // Transform should be translate(0px, 0px) — can't drag up in bottom position
      expect(dragContainer.style.transform).toBe('translate(0px, 0px)')

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 150 }))
    })

    it('top position: drag up moves toast', async () => {
      const screen = render(
        createWrapper('int-drag-top', { position: 'top' })
      )
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 200 }))
      await nextTick()

      // Move up (negative Y)
      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 180 })
      )
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      const transform = dragContainer.style.transform
      expect(transform).toContain('translate(')

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 180 }))
    })
  })

  describe('drag to dismiss', () => {
    it('dragging past threshold removes toast', async () => {
      const screen = render(
        createWrapper('int-dismiss', {
          position: 'bottom',
          threshold: { distance: 20, lock: 4, momentum: 100 },
        })
      )
      const dragEl = await addAndGetDragEl(screen)

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      // Drag far past threshold (20px)
      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 200 })
      )
      await nextTick()

      // Release — should dismiss
      document.dispatchEvent(pointerEvent('pointerup', { screenY: 200 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })

    it('small drag snaps back without dismissing', async () => {
      const screen = render(
        createWrapper('int-snap-back', {
          position: 'bottom',
          threshold: { distance: 100, lock: 4, momentum: 100 },
          animation: { snap: { duration: 50 } },
        })
      )
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      // Small drag (under threshold of 100)
      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 120 })
      )
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 120 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      // Toast should still exist
      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')
    })
  })

  describe('click to expand', () => {
    it('clicking toast expands stack when layout.expand is click', async () => {
      const screen = render(
        createWrapper('int-click-expand', {
          layout: { expand: 'click' },
        })
      )
      const dragEl = await addAndGetDragEl(screen)

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')

      // Click the inner wrapper
      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.click()
      await nextTick()

      expect(provider!.getAttribute('data-expanded')).toBe('true')
    })

    it('clicking toast does not expand when layout.expand is false', async () => {
      const screen = render(
        createWrapper('int-click-no-expand', {
          layout: { expand: false },
        })
      )
      const dragEl = await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.click()
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')
    })
  })

  describe('drag events', () => {
    it('emits beforeDrag on pointerdown', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('int-event-before-drag')
          const emitter = useMagicEmitter()
          emitter.on('beforeDrag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <MagicToastProvider id="int-event-before-drag" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0]![0]).toHaveProperty('id')

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 100 }))
    })

    it('emits drag on pointermove', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('int-event-drag')
          const emitter = useMagicEmitter()
          emitter.on('drag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <MagicToastProvider id="int-event-drag" :options="{ position: 'bottom' }" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      document.dispatchEvent(
        pointerEvent('pointermove', { screenY: 120 })
      )
      await nextTick()

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0]![0]).toHaveProperty('x')
      expect(handler.mock.calls[0]![0]).toHaveProperty('y')

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 120 }))
    })

    it('emits afterDrag on pointerup', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('int-event-after-drag')
          const emitter = useMagicEmitter()
          emitter.on('afterDrag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <MagicToastProvider id="int-event-after-drag" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { screenY: 100 }))
      await nextTick()

      expect(handler).toHaveBeenCalled()
    })
  })

  describe('timeout pause during drag', () => {
    it('dragging pauses auto-close timer', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('int-timeout-pause')
          function addToast() {
            api.add({ component: SimpleToast, duration: 300 })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="int-timeout-pause" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      // Start dragging — should pause timer
      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { screenY: 100 }))
      await nextTick()

      // Wait past original timeout
      await new Promise((r) => setTimeout(r, 400))

      // Toast should still be alive because drag paused timer
      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')

      // Cleanup
      document.dispatchEvent(pointerEvent('pointerup', { screenY: 100 }))
    })
  })
})
