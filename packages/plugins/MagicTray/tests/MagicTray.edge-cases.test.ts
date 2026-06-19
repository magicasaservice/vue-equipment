import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick, ref, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function pointer(type: string, screenY: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    screenX: 100,
    screenY,
  })
}

function warningsMatching(spy: ReturnType<typeof vi.spyOn>, needle: string) {
  return spy.mock.calls.filter((call: unknown[]) =>
    call.some((arg: unknown) => typeof arg === 'string' && arg.includes(needle))
  )
}

describe('MagicTray - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (bottom side, default snap points)', async () => {
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.EdgeDefault)
          const progressBottom = computed(() => api.progress.value.bottom)
          return { progressBottom }
        },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeDefault}">
            <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      // The default config makes the bottom side draggable
      const handle = container.querySelector('.magic-tray-handle[data-side="bottom"]')
      expect(handle).not.toBeNull()

      handle!.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 60))

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
        .toBeGreaterThan(0)
    })
  })

  describe('snap point validation warnings', () => {
    it('warns when a draggable side has no `0` snap point and no initial', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeWarnNoZero}" :options="{ snapPoints: { bottom: [0.5, 1] } }">
            <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(
        warningsMatching(warnSpy, 'no `0` snap point').length
      ).toBeGreaterThan(0)
      warnSpy.mockRestore()
    })

    it('does not warn when the side can fully open', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeNoWarnZero}" :options="{ snapPoints: { bottom: [0, 0.5, 1] } }">
            <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(warningsMatching(warnSpy, 'no `0` snap point').length).toBe(0)
      warnSpy.mockRestore()
    })
  })

  describe('snapTo on a side without snap points', () => {
    it('warns and is a safe no-op', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.EdgeSnapNoPoints)
          const progressTop = computed(() => api.progress.value.top)
          // `top` has no snap points configured
          return { progressTop, snap: () => api.snapTo('top', 0.5) }
        },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeSnapNoPoints}" :options="{ snapPoints: { bottom: [0, 1] } }">
            <span data-test-id="${TestId.ProgressTop}">{{ progressTop }}</span>
            <button data-test-id="${TestId.SnapBtn}" @click="snap">Snap</button>
            <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const snapBtn = container.querySelector(
        `[data-test-id="${TestId.SnapBtn}"]`
      ) as HTMLElement
      expect(() => snapBtn.click()).not.toThrow()

      await new Promise((r) => setTimeout(r, 100))

      expect(
        warningsMatching(warnSpy, 'Cannot snap side').length
      ).toBeGreaterThan(0)
      expect(
        Number(
          container.querySelector(`[data-test-id="${TestId.ProgressTop}"]`)!
            .textContent
        )
      ).toBe(0)

      warnSpy.mockRestore()
    })
  })

  describe('overshoot CSS variable parsing', () => {
    it('warns when --magic-tray-drag-overshoot-inner has an invalid unit', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeOvershootInvalid}" :options="{ snapPoints: { bottom: [0, 1] } }">
            <MagicTrayContent style="--magic-tray-drag-overshoot-inner: invalid">
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(
        warningsMatching(warnSpy, '--magic-tray-drag-overshoot-inner').length
      ).toBeGreaterThan(0)
      warnSpy.mockRestore()
    })

    it('accepts a rem overshoot value without warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeOvershootRem}" :options="{ snapPoints: { bottom: [0, 1] } }">
            <MagicTrayContent style="--magic-tray-drag-overshoot-inner: 2rem">
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(
        warningsMatching(warnSpy, '--magic-tray-drag-overshoot-inner').length
      ).toBe(0)
      warnSpy.mockRestore()
    })
  })

  describe('concurrent instances', () => {
    it('keeps trays with different ids independent', async () => {
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const t1 = useMagicTray(TrayId.EdgeConcurrent1)
          const t2 = useMagicTray(TrayId.EdgeConcurrent2)
          const t3 = useMagicTray(TrayId.EdgeConcurrent3)
          return {
            snapAll: () => {
              t1.snapTo('bottom', 1)
              t2.snapTo('bottom', 0.5)
              // t3 is left untouched
            },
            p1: computed(() => t1.progress.value.bottom),
            p2: computed(() => t2.progress.value.bottom),
            p3: computed(() => t3.progress.value.bottom),
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.SnapAll}" @click="snapAll">Snap</button>
            <span data-test-id="${TestId.Active1}">{{ p1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ p2 }}</span>
            <span data-test-id="${TestId.Active3}">{{ p3 }}</span>
            <MagicTrayProvider id="${TrayId.EdgeConcurrent1}" :options="{ snapPoints: { bottom: [0, 0.5, 1] } }">
              <MagicTrayContent><div style="width: 200px; height: 200px;">1</div></MagicTrayContent>
            </MagicTrayProvider>
            <MagicTrayProvider id="${TrayId.EdgeConcurrent2}" :options="{ snapPoints: { bottom: [0, 0.5, 1] } }">
              <MagicTrayContent><div style="width: 200px; height: 200px;">2</div></MagicTrayContent>
            </MagicTrayProvider>
            <MagicTrayProvider id="${TrayId.EdgeConcurrent3}" :options="{ snapPoints: { bottom: [0, 0.5, 1] } }">
              <MagicTrayContent><div style="width: 200px; height: 200px;">3</div></MagicTrayContent>
            </MagicTrayProvider>
          </div>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      ;(
        container.querySelector(
          `[data-test-id="${TestId.SnapAll}"]`
        ) as HTMLElement
      ).click()

      const read = (id: TestId) =>
        Number(container.querySelector(`[data-test-id="${id}"]`)!.textContent)

      await expect
        .poll(() => read(TestId.Active1), { timeout: 2000 })
        .toBeGreaterThan(0.9)
      await expect
        .poll(() => read(TestId.Active2), { timeout: 2000 })
        .toBeGreaterThan(0.4)
      // The third tray was never snapped and stays open
      expect(read(TestId.Active3)).toBe(0)
      expect(read(TestId.Active2)).toBeLessThan(0.9)
    })
  })

  describe('cleanup on unmount', () => {
    it('removes the tray and survives a remount with the same id', async () => {
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const show = ref(true)
          return { show }
        },
        template: `
          <div>
            <button data-test-id="${TestId.ToggleBtn}" @click="show = !show">Toggle</button>
            <MagicTrayProvider v-if="show" id="${TrayId.EdgeUnmount}" :options="{ snapPoints: { bottom: [0, 1] } }">
              <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
            </MagicTrayProvider>
          </div>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(
        container.querySelector(`[data-id="${TrayId.EdgeUnmount}"]`)
      ).not.toBeNull()

      const toggle = container.querySelector(
        `[data-test-id="${TestId.ToggleBtn}"]`
      ) as HTMLElement

      // Unmount
      toggle.click()
      await nextTick()
      await nextTick()
      expect(
        container.querySelector(`[data-id="${TrayId.EdgeUnmount}"]`)
      ).toBeNull()

      // Remount with the same id should rebuild a fresh tray without throwing
      expect(() => toggle.click()).not.toThrow()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))
      expect(
        container.querySelector(`[data-id="${TrayId.EdgeUnmount}"]`)
      ).not.toBeNull()
    })
  })

  describe('disabled during drag', () => {
    it('stops an in-progress drag when disabled flips to true', async () => {
      const options = ref<Record<string, unknown>>({
        snapPoints: { bottom: [0, 0.5, 1] },
        disabled: false,
      })

      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.EdgeDisabledDuringDrag)
          const dragging = computed(() => api.state.dragging)
          return { options, dragging }
        },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeDisabledDuringDrag}" :options="options">
            <span data-test-id="${TestId.Content}">{{ dragging }}</span>
            <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 120))
      await nextTick()

      expect(
        container.querySelector(`[data-test-id="${TestId.Content}"]`)!
          .textContent
      ).toBe('true')

      options.value = { snapPoints: { bottom: [0, 0.5, 1] }, disabled: true }
      await nextTick()
      await nextTick()

      expect(
        container.querySelector(`[data-test-id="${TestId.Content}"]`)!
          .textContent
      ).toBe('false')

      document.dispatchEvent(pointer('pointerup', 120))
    })
  })

  describe('rapid programmatic snapping', () => {
    it('handles a burst of snapTo calls without breaking state', async () => {
      const wrapper = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent },
        setup() {
          const api = useMagicTray(TrayId.EdgeRapidSnap)
          const progressBottom = computed(() => api.progress.value.bottom)
          return {
            progressBottom,
            burst: () => {
              api.snapTo('bottom', 0)
              api.snapTo('bottom', 1)
              api.snapTo('bottom', 0.5)
              api.snapTo('bottom', 1)
            },
          }
        },
        template: `
          <MagicTrayProvider id="${TrayId.EdgeRapidSnap}" :options="{ snapPoints: { bottom: [0, 0.5, 1] } }">
            <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
            <button data-test-id="${TestId.RapidBtn}" @click="burst">Burst</button>
            <MagicTrayContent><div style="width: 200px; height: 200px;">Content</div></MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = mountWithApp(wrapper)
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      ;(
        container.querySelector(
          `[data-test-id="${TestId.RapidBtn}"]`
        ) as HTMLElement
      ).click()

      // The last call wins and the side settles fully clipped
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
  })
})
