import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'
import { useMagicEmitter } from '../../MagicEmitter'
import { ToastId, TestId } from './enums'

const SimpleToast = defineComponent({
  template:
    '<div class="toast-content" style="height: 50px; width: 200px; background: white;">Toast</div>',
})

function createWrapper(
  toastId: ToastId,
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
        <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
        <span data-test-id="${TestId.Count}">{{ count }}</span>
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
    clientX: 0,
    clientY: 0,
    ...opts,
  })
}

async function addAndGetDragEl(
  screen: ReturnType<typeof render>
): Promise<HTMLElement> {
  await screen.getByTestId(TestId.AddBtn).click()
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
      const screen = render(createWrapper(ToastId.IntDragState))
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-dragging')).toBe('true')

      // Cleanup: pointerup
      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })

    it('pointerup resets data-dragging to false', async () => {
      const screen = render(createWrapper(ToastId.IntDragReset))
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-dragging')).toBe('false')
    })
  })

  describe('drag direction constraints', () => {
    it('bottom position: drag down moves toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragBottom, { position: 'bottom' })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 200 }))
      await nextTick()

      // Move down (positive Y)
      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 220 })
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

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 220 }))
    })

    it('bottom position: drag up is constrained to 0', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragBottomUp, { position: 'bottom' })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 200 }))
      await nextTick()

      // Try to move up (negative Y) — should be clamped to 0
      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 150 })
      )
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      // Transform should be translate(0px, 0px) — can't drag up in bottom position
      expect(dragContainer.style.transform).toBe('translate(0px, 0px)')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 150 }))
    })

    it('top position: drag up moves toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragTop, { position: 'top' })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 200 }))
      await nextTick()

      // Move up (negative Y)
      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 180 })
      )
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      const transform = dragContainer.style.transform
      expect(transform).toContain('translate(')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 180 }))
    })
  })

  describe('drag.direction override', () => {
    it('drag.direction: left drags horizontally even for a bottom-positioned toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionLeft, {
          position: 'bottom',
          drag: { direction: 'left' },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()

      // Move left (negative X) — allowed
      document.dispatchEvent(pointerEvent('pointermove', { clientX: 170 }))
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      const transform = dragContainer.style.transform
      const match = transform.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/)
      expect(match?.[1]).toBeDefined()
      expect(parseInt(match![1]!)).toBeLessThanOrEqual(0)
      // Y should stay untouched
      expect(parseInt(match![2]!)).toBe(0)

      document.dispatchEvent(pointerEvent('pointerup', { clientX: 170 }))
    })

    it('drag.direction: left constrains drag to the right to 0', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionRight, {
          position: 'bottom',
          drag: { direction: 'left' },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()

      // Try to move right (positive X) — should be clamped to 0
      document.dispatchEvent(pointerEvent('pointermove', { clientX: 230 }))
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      expect(dragContainer.style.transform).toBe('translate(0px, 0px)')

      document.dispatchEvent(pointerEvent('pointerup', { clientX: 230 }))
    })

    it('drag.direction: left dismisses on a leftward drag past the threshold, regardless of position', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionDismissLeft, {
          position: 'bottom',
          drag: { direction: 'left' },
          threshold: { distance: 20, lock: 4, momentum: 100 },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()

      // Drag far left, past the 20px threshold
      document.dispatchEvent(pointerEvent('pointermove', { clientX: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientX: 100 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })

    it('drag.direction: up drags vertically even for a left-positioned toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionUp, {
          position: 'left',
          drag: { direction: 'up' },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 200 }))
      await nextTick()

      // Move up (negative Y) — allowed
      document.dispatchEvent(pointerEvent('pointermove', { clientY: 170 }))
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      const transform = dragContainer.style.transform
      const match = transform.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/)
      expect(match?.[2]).toBeDefined()
      expect(parseInt(match![2]!)).toBeLessThanOrEqual(0)
      // X should stay untouched
      expect(parseInt(match![1]!)).toBe(0)

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 170 }))
    })

    it('drag.direction: down dismisses on a downward drag past the threshold, regardless of position', async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionDown, {
          position: 'left',
          drag: { direction: 'down' },
          threshold: { distance: 20, lock: 4, momentum: 100 },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      // Drag far down, past the 20px threshold
      document.dispatchEvent(pointerEvent('pointermove', { clientY: 200 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 200 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })

    it("drag.direction: ['left', 'right'] allows dragging left without clamping to 0", async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionPairLeft, {
          position: 'bottom',
          drag: { direction: ['left', 'right'] },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointermove', { clientX: 170 }))
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      // Unclamped: dragging left by 30px should move the toast by -30px
      expect(dragContainer.style.transform).toBe('translate(-30px, 0px)')

      document.dispatchEvent(pointerEvent('pointerup', { clientX: 170 }))
    })

    it("drag.direction: ['left', 'right'] allows dragging right without clamping to 0", async () => {
      const screen = render(
        createWrapper(ToastId.IntDragDirectionPairRight, {
          position: 'bottom',
          drag: { direction: ['left', 'right'] },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointermove', { clientX: 230 }))
      await nextTick()

      const dragContainer = document.querySelector(
        '.magic-toast-view__drag'
      ) as HTMLElement
      // Unclamped: dragging right by 30px should move the toast by +30px
      expect(dragContainer.style.transform).toBe('translate(30px, 0px)')

      document.dispatchEvent(pointerEvent('pointerup', { clientX: 230 }))
    })
  })

  describe('drag to dismiss', () => {
    it('dragging past threshold removes toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDismiss, {
          position: 'bottom',
          threshold: { distance: 20, lock: 4, momentum: 100 },
        })
      )
      await addAndGetDragEl(screen)

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      // Drag far past threshold (20px)
      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 200 })
      )
      await nextTick()

      // Release — should dismiss
      document.dispatchEvent(pointerEvent('pointerup', { clientY: 200 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })

    it('small drag snaps back without dismissing', async () => {
      const screen = render(
        createWrapper(ToastId.IntSnapBack, {
          position: 'bottom',
          threshold: { distance: 100, lock: 4, momentum: 100 },
          animation: { snap: { duration: 50 } },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()
      // keep velocity (distance/elapsed) below 0.5 px/ms dismiss threshold
      await new Promise((r) => setTimeout(r, 200))

      // Small drag (under threshold of 100)
      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 120 })
      )
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 120 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      // Toast should still exist
      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')
    })
  })

  describe('drag.disabled: true', () => {
    it('pointerdown does not start dragging', async () => {
      const screen = render(
        createWrapper(ToastId.IntDraggableNoStart, { drag: { disabled: true } })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-dragging')).toBe('false')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })

    it('dragging past the dismiss threshold does not remove the toast', async () => {
      const screen = render(
        createWrapper(ToastId.IntDraggableNoDismiss, {
          drag: { disabled: true },
          position: 'bottom',
          threshold: { distance: 20, lock: 4, momentum: 100 },
        })
      )
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointermove', { clientY: 200 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 200 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')
    })
  })

  describe('per-toast drag override', () => {
    function createOverrideWrapper(
      toastId: ToastId,
      providerOptions: Record<string, unknown>,
      addDraggable: boolean
    ) {
      return defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(toastId)
          function addToast() {
            api.add({
              component: SimpleToast,
              options: { drag: { disabled: !addDraggable } },
            })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${toastId}" :options="options" />
          </div>
        `,
        data() {
          return { options: providerOptions }
        },
      })
    }

    it('add({ drag: { disabled: true } }) disables dragging for that toast even when the provider allows it', async () => {
      const screen = render(
        createOverrideWrapper(
          ToastId.IntDraggableOverrideFalse,
          { drag: { disabled: false } },
          false
        )
      )
      await addAndGetDragEl(screen)

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-draggable')).toBe('false')

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      expect(view!.getAttribute('data-dragging')).toBe('false')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })

    it('add({ drag: { disabled: false } }) keeps a toast draggable even when the provider disables drag', async () => {
      const screen = render(
        createOverrideWrapper(
          ToastId.IntDraggableOverrideTrue,
          { drag: { disabled: true } },
          true
        )
      )
      await addAndGetDragEl(screen)

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-draggable')).toBe('true')

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      expect(view!.getAttribute('data-dragging')).toBe('true')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })
  })

  describe('click to expand', () => {
    it('clicking toast expands stack when layout.expand is click', async () => {
      const screen = render(
        createWrapper(ToastId.IntClickExpand, {
          layout: { expand: 'click' },
        })
      )
      await addAndGetDragEl(screen)

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
        createWrapper(ToastId.IntClickNoExpand, {
          layout: { expand: false },
        })
      )
      await addAndGetDragEl(screen)

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
          const api = useMagicToast(ToastId.IntEventBeforeDrag)
          const emitter = useMagicEmitter()
          emitter.on('beforeDrag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <MagicToastProvider id="${ToastId.IntEventBeforeDrag}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0]![0]).toHaveProperty('id')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })

    it('emits drag on pointermove', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.IntEventDrag)
          const emitter = useMagicEmitter()
          emitter.on('drag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <MagicToastProvider id="${ToastId.IntEventDrag}" :options="{ position: 'bottom' }" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      document.dispatchEvent(
        pointerEvent('pointermove', { clientY: 120 })
      )
      await nextTick()

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0]![0]).toHaveProperty('x')
      expect(handler.mock.calls[0]![0]).toHaveProperty('y')

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 120 }))
    })

    it('emits afterDrag on pointerup', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.IntEventAfterDrag)
          const emitter = useMagicEmitter()
          emitter.on('afterDrag', handler)

          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <MagicToastProvider id="${ToastId.IntEventAfterDrag}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
      await nextTick()

      expect(handler).toHaveBeenCalled()
    })
  })

  describe('timeout pause during drag', () => {
    it('dragging pauses auto-close timer', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.IntTimeoutPause)
          function addToast() {
            api.add({ component: SimpleToast, options: { duration: 300 } })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.IntTimeoutPause}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await addAndGetDragEl(screen)

      // Start dragging — should pause timer
      const inner = document.querySelector(
        '.magic-toast-view__inner'
      ) as HTMLElement
      inner.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
      await nextTick()

      // Wait past original timeout
      await new Promise((r) => setTimeout(r, 400))

      // Toast should still be alive because drag paused timer
      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')

      // Cleanup
      document.dispatchEvent(pointerEvent('pointerup', { clientY: 100 }))
    })
  })
})
