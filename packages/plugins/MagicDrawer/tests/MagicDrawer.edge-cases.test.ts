import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTrigger from '../src/components/MagicDrawerTrigger.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

function createDrawer(id: DrawerId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const { open, close, isActive } = useMagicDrawer(id)
      return { open, close, isActive }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div data-test-id="${TestId.DrawerContent}" style="height: 200px; width: 100%;">Content</div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
    data() { return { options } },
  })
}

function createRapidDrawer(id: DrawerId) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const { open, close, isActive } = useMagicDrawer(id)
      function rapidToggle() { open(); close(); open(); close(); open() }
      function doubleOpen() { open(); open() }
      function doubleClose() { close(); close() }
      return { open, close, isActive, rapidToggle, doubleOpen, doubleClose }
    },
    template: `
      <MagicDrawerProvider id="${id}">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <button data-test-id="${TestId.RapidBtn}" @click="rapidToggle">Rapid</button>
        <button data-test-id="${TestId.DoubleOpenBtn}" @click="doubleOpen">DblOpen</button>
        <button data-test-id="${TestId.DoubleCloseBtn}" @click="doubleClose">DblClose</button>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent><div>Content</div></MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
  })
}

describe('MagicDrawer - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createDrawer(DrawerId.Default))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })
  })

  describe('warning messages', () => {
    it('snapTo on closed drawer is a safe no-op', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open, isActive, snapTo } = useMagicDrawer(DrawerId.WarnSnap)
          return { open, isActive, trySnap: () => snapTo(0.5) }
        },
        template: `
          <MagicDrawerProvider id="${DrawerId.WarnSnap}" :options="{ snapPoints: [0.5, 1] }">
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <button data-test-id="${TestId.SnapBtn}" @click="trySnap">Snap</button>
            <MagicDrawerTeleport>
              <MagicDrawerBackdrop />
              <MagicDrawerContent><div>Content</div></MagicDrawerContent>
            </MagicDrawerTeleport>
          </MagicDrawerProvider>
        `,
      })

      const screen = render(wrapper)
      await nextTick()

      await expect(screen.getByTestId(TestId.SnapBtn).click()).resolves.not.toThrow()
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('invalid overshoot CSS value triggers warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      // Set on body so the teleported content element inherits it
      document.body.style.setProperty('--magic-drawer-drag-overshoot', 'invalid')

      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootWarn)
          return { open, isActive }
        },
        template: `
          <MagicDrawerProvider id="${DrawerId.OvershootWarn}">
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <MagicDrawerTeleport>
              <MagicDrawerBackdrop />
              <MagicDrawerContent><div>Content</div></MagicDrawerContent>
            </MagicDrawerTeleport>
          </MagicDrawerProvider>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const warningCalls = warnSpy.mock.calls.filter((call) =>
        call.some((arg) => typeof arg === 'string' && arg.includes('--magic-drawer-drag-overshoot'))
      )
      expect(warningCalls.length).toBeGreaterThan(0)
      document.body.style.removeProperty('--magic-drawer-drag-overshoot')
      warnSpy.mockRestore()
    })
  })

  describe('rapid state changes', () => {
    it('rapid open/close does not break state', async () => {
      const screen = render(createRapidDrawer(DrawerId.RapidDrawer))
      await screen.getByTestId(TestId.RapidBtn).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidDrawer(DrawerId.DoubleOpen))
      await screen.getByTestId(TestId.DoubleOpenBtn).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidDrawer(DrawerId.DoubleClose))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      ;(document.querySelector(`[data-test-id="${TestId.DoubleCloseBtn}"]`) as HTMLElement).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting closes the drawer', async () => {
      const container = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.UnmountDrawer)
          return { open, isActive }
        },
        data() { return { show: true } },
        template: `
          <div>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="show = !show">Toggle</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawerProvider v-if="show" id="${DrawerId.UnmountDrawer}">
              <MagicDrawerTeleport>
                <MagicDrawerBackdrop />
                <MagicDrawerContent><div>Content</div></MagicDrawerContent>
              </MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      ;(document.querySelector(`[data-test-id="${TestId.ToggleBtn}"]`) as HTMLElement).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('unmounting cleans up scroll lock', async () => {
      const container = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open } = useMagicDrawer(DrawerId.CleanupScroll)
          return { open }
        },
        data() { return { show: true } },
        template: `
          <div>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="show = !show">Toggle</button>
            <MagicDrawerProvider v-if="show" id="${DrawerId.CleanupScroll}" :options="{ scrollLock: true }">
              <MagicDrawerTeleport>
                <MagicDrawerBackdrop />
                <MagicDrawerContent><div>Content</div></MagicDrawerContent>
              </MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      ;(document.querySelector(`[data-test-id="${TestId.ToggleBtn}"]`) as HTMLElement).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.documentElement.style.overflow).not.toBe('hidden')
    })
  })

  describe('overshoot CSS variable parsing', () => {
    it('handles px overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootPx)
          return { open, isActive }
        },
        template: `
          <div style="--magic-drawer-drag-overshoot: 32px">
            <MagicDrawerProvider id="${DrawerId.OvershootPx}">
              <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
              <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
              <MagicDrawerTeleport>
                <MagicDrawerBackdrop />
                <MagicDrawerContent><div>Content</div></MagicDrawerContent>
              </MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('handles rem overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootRem)
          return { open, isActive }
        },
        template: `
          <div style="--magic-drawer-drag-overshoot: 2rem">
            <MagicDrawerProvider id="${DrawerId.OvershootRem}">
              <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
              <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
              <MagicDrawerTeleport>
                <MagicDrawerBackdrop />
                <MagicDrawerContent><div>Content</div></MagicDrawerContent>
              </MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('concurrent instances', () => {
    it('opening multiple drawers simultaneously works', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const d1 = useMagicDrawer(DrawerId.Concurrent1)
          const d2 = useMagicDrawer(DrawerId.Concurrent2)
          const d3 = useMagicDrawer(DrawerId.Concurrent3)
          return {
            openAll: () => { d1.open(); d2.open(); d3.open() },
            isActive1: d1.isActive,
            isActive2: d2.isActive,
            isActive3: d3.isActive,
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenAll}" @click="openAll">Open All</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <span data-test-id="${TestId.Active3}">{{ isActive3 }}</span>
            <MagicDrawerProvider id="${DrawerId.Concurrent1}">
              <MagicDrawerTeleport><MagicDrawerBackdrop /><MagicDrawerContent><div>1</div></MagicDrawerContent></MagicDrawerTeleport>
            </MagicDrawerProvider>
            <MagicDrawerProvider id="${DrawerId.Concurrent2}">
              <MagicDrawerTeleport><MagicDrawerBackdrop /><MagicDrawerContent><div>2</div></MagicDrawerContent></MagicDrawerTeleport>
            </MagicDrawerProvider>
            <MagicDrawerProvider id="${DrawerId.Concurrent3}">
              <MagicDrawerTeleport><MagicDrawerBackdrop /><MagicDrawerContent><div>3</div></MagicDrawerContent></MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenAll).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.Active1)).toHaveTextContent('true')
      await expect.element(page.getByTestId(TestId.Active2)).toHaveTextContent('true')
      await expect.element(page.getByTestId(TestId.Active3)).toHaveTextContent('true')
    })
  })
})
