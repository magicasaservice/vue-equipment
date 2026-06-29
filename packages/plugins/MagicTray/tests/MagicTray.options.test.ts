import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick, ref, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function createTray(
  id: TrayId,
  options: Record<string, unknown> = {},
  contentStyle = ''
) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const progressBottom = computed(() => api.progress.value.bottom)
      const dragging = computed(() => api.state.dragging)
      return { progressBottom, dragging }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
        <MagicTrayContent style="${contentStyle}">
          <div style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

function pointer(type: string, clientY: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    clientX: 100,
    clientY,
  })
}

describe('MagicTray - Options', () => {
  describe('tag', () => {
    it('defaults to a div inner element', async () => {
      render(createTray(TrayId.OptTagDiv))
      await nextTick()
      const inner = document.querySelector(
        `[data-id="${TrayId.OptTagDiv}"] .magic-tray-content__inner`
      )
      expect(inner!.tagName.toLowerCase()).toBe('div')
    })

    it('renders the configured tag for the inner element', async () => {
      render(createTray(TrayId.OptTagDialog, { tag: 'dialog' }))
      await nextTick()
      const inner = document.querySelector(
        `[data-id="${TrayId.OptTagDialog}"] .magic-tray-content__inner`
      )
      expect(inner!.tagName.toLowerCase()).toBe('dialog')
    })
  })

  describe('inset', () => {
    it('defaults data-inset to false', async () => {
      render(createTray(TrayId.OptInsetFalse))
      await nextTick()
      const el = document.querySelector(`[data-id="${TrayId.OptInsetFalse}"]`)
      expect(el!.getAttribute('data-inset')).toBe('false')
    })

    it('reflects inset: true via data-inset', async () => {
      render(createTray(TrayId.OptInsetTrue, { inset: true }))
      await nextTick()
      const el = document.querySelector(`[data-id="${TrayId.OptInsetTrue}"]`)
      expect(el!.getAttribute('data-inset')).toBe('true')
    })
  })

  describe('snapPoints', () => {
    const sides = [
      { side: 'top' as const, id: TrayId.OptSideTop },
      { side: 'right' as const, id: TrayId.OptSideRight },
      { side: 'left' as const, id: TrayId.OptSideLeft },
    ]

    for (const { side, id } of sides) {
      it(`makes the ${side} side draggable when given snap points`, async () => {
        render(createTray(id, { snapPoints: { [side]: [0, 1] } }))
        await nextTick()
        await nextTick()

        const inner = document.querySelector(
          `[data-id="${id}"] .magic-tray-content__inner`
        )
        expect(inner!.getAttribute(`data-drag-${side}`)).toBe('true')

        const handle = document.querySelector(
          `[data-id="${id}"] .magic-tray-handle[data-side="${side}"]`
        )
        expect(handle).not.toBeNull()
      })
    }

    it('accepts pixel snap points and snaps to them', async () => {
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.OptSnapPx)
          const progressBottom = computed(() => api.progress.value.bottom)
          return { progressBottom, snap: () => api.snapTo('bottom', '100px') }
        },
        template: `
          <MagicTrayProvider id="${TrayId.OptSnapPx}" :options="{ snapPoints: { bottom: ['0px', '100px'] } }">
            <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
            <button data-test-id="${TestId.SnapBtn}" @click="snap">Snap</button>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      ;(
        container.querySelector(
          `[data-test-id="${TestId.SnapBtn}"]`
        ) as HTMLElement
      ).click()

      // 100px of a 200px tall content settles around half progress
      await expect
        .poll(
          () =>
            Number(
              container.querySelector(
                `[data-test-id="${TestId.ProgressBottom}"]`
              )!.textContent
            ),
          { timeout: 2000 }
        )
        .toBeGreaterThan(0.3)
    })
  })

  describe('handles', () => {
    it('renders a handle only for sides enabled in a handles object', async () => {
      render(
        createTray(TrayId.OptHandlesObject, {
          snapPoints: { top: [0, 1], bottom: [0, 1] },
          handles: { bottom: true },
        })
      )
      await nextTick()
      await nextTick()

      const handles = document.querySelectorAll(
        `[data-id="${TrayId.OptHandlesObject}"] .magic-tray-handle`
      )
      expect(handles.length).toBe(1)
      expect(handles[0]!.getAttribute('data-side')).toBe('bottom')
    })
  })

  describe('disabled', () => {
    it('does not begin dragging when disabled', async () => {
      const { container } = mountWithApp(
        createTray(TrayId.OptDisabledDrag, {
          snapPoints: { bottom: [0, 0.5, 1] },
          disabled: true,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement
      expect(handle).not.toBeNull()

      handle.dispatchEvent(pointer('pointerdown', 200))
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()

      const content = container.querySelector('.magic-tray-content')!
      expect(content.getAttribute('data-dragging')).toBe('false')

      document.dispatchEvent(pointer('pointerup', 60))
    })

    it('reacts to disabled toggling at runtime', async () => {
      const options = ref({ disabled: false })

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          return { options }
        },
        template: `
          <MagicTrayProvider id="${TrayId.OptDisabledReactive}" :options="options">
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()

      const content = container.querySelector('.magic-tray-content')!
      expect(content.getAttribute('data-disabled')).toBe('false')

      options.value = { disabled: true }
      await nextTick()
      await nextTick()

      expect(content.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('initial', () => {
    it('opens each draggable side at its configured initial snap point', async () => {
      const { container } = mountWithApp(
        createTray(TrayId.OptInitialSnap, {
          snapPoints: { bottom: [0, 0.5, 1] },
          initial: { snapPoints: { bottom: 1 } },
        })
      )

      // Without an initial point the side rests open (progress 0); with
      // `initial.snapPoints.bottom = 1` it should mount fully clipped.
      await expect
        .poll(
          () =>
            Number(
              container.querySelector(
                `[data-test-id="${TestId.ProgressBottom}"]`
              )!.textContent
            ),
          { timeout: 2000 }
        )
        .toBeGreaterThan(0.9)
    })

    it('transitions into the initial snap point on mount', async () => {
      const { container } = mountWithApp(
        createTray(TrayId.OptInitialTransition, {
          snapPoints: { bottom: [0, 0.5, 1] },
          initial: { snapPoints: { bottom: 0.5 }, transition: true },
        })
      )

      await expect
        .poll(
          () =>
            Number(
              container.querySelector(
                `[data-test-id="${TestId.ProgressBottom}"]`
              )!.textContent
            ),
          { timeout: 2000 }
        )
        .toBeGreaterThan(0.4)
    })
  })

  describe('animation', () => {
    it('uses the configured snap easing function when interpolating', async () => {
      const easing = vi.fn((t: number) => t)
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.OptCustomEasing)
          const progressBottom = computed(() => api.progress.value.bottom)
          return { progressBottom, snap: () => api.snapTo('bottom', 0.5) }
        },
        data() {
          return {
            options: {
              snapPoints: { bottom: [0, 0.5, 1] },
              animation: { snap: { duration: 120, easing } },
            },
          }
        },
        template: `
          <MagicTrayProvider id="${TrayId.OptCustomEasing}" :options="options">
            <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
            <button data-test-id="${TestId.SnapBtn}" @click="snap">Snap</button>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const snapBtn = container.querySelector(
        `[data-test-id="${TestId.SnapBtn}"]`
      ) as HTMLElement
      expect(() => snapBtn.click()).not.toThrow()

      await expect
        .poll(
          () =>
            Number(
              container.querySelector(
                `[data-test-id="${TestId.ProgressBottom}"]`
              )!.textContent
            ),
          { timeout: 2000 }
        )
        .toBeGreaterThan(0.4)

      expect(easing).toHaveBeenCalled()
    })
  })

  describe('threshold', () => {
    it('springs back to the open position when neither distance nor momentum is met', async () => {
      const { container } = mountWithApp(
        createTray(TrayId.OptThresholdHigh, {
          snapPoints: { bottom: [0, 0.5, 1] },
          threshold: { distance: 99999, momentum: 99999 },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const read = () =>
        Number(
          container.querySelector(`[data-test-id="${TestId.ProgressBottom}"]`)!
            .textContent
        )

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()

      // The drag itself registers
      expect(read()).toBeGreaterThan(0)

      document.dispatchEvent(pointer('pointerup', 60))

      // But with unreachable thresholds it settles back to the open snap point
      await expect.poll(read, { timeout: 2000 }).toBe(0)
    })
  })
})
