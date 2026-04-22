import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  drawerId: DrawerId,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive, snapTo } = useMagicDrawer(drawerId)
      return { open, close, isActive, snapTo }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-test-id="${TestId.DrawerContent}" style="height: 200px; width: 100%;">Content</div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createRapidWrapper(drawerId: DrawerId) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer(drawerId)

      function rapidToggle() {
        open()
        close()
        open()
        close()
        open() // final state: open
      }

      function doubleOpen() {
        open()
        open()
      }

      function openThenDoubleClose() {
        close()
        close()
      }

      return { open, close, isActive, rapidToggle, doubleOpen, openThenDoubleClose }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <button data-test-id="${TestId.RapidBtn}" @click="rapidToggle">Rapid</button>
        <button data-test-id="${TestId.DoubleOpenBtn}" @click="doubleOpen">DblOpen</button>
        <button data-test-id="${TestId.DoubleCloseBtn}" @click="openThenDoubleClose">DblClose</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}">
          <div>Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDrawer - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createWrapper(DrawerId.Default))
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })
  })

  describe('warning messages', () => {
    it('snapTo on closed drawer logs warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, close, isActive, snapTo } = useMagicDrawer(DrawerId.WarnSnap)
          return {
            open,
            close,
            isActive,
            trySnap: () => snapTo(0.5),
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <button data-test-id="${TestId.SnapBtn}" @click="trySnap">Snap</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawer id="${DrawerId.WarnSnap}" :options="{ snapPoints: [0.5, 1] }">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await nextTick()

      await screen.getByTestId(TestId.SnapBtn).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const warningCalls = warnSpy.mock.calls.filter(
        (call: unknown[]) =>
          call.some(
            (arg: unknown) =>
              typeof arg === 'string' && arg.includes('[MagicDrawer]')
          ) &&
          call.some(
            (arg: unknown) =>
              typeof arg === 'string' &&
              arg.includes('Cannot snap to point')
          )
      )
      expect(warningCalls.length).toBeGreaterThan(0)

      warnSpy.mockRestore()
    })

    it('invalid overshoot CSS value triggers warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootWarn)
          return { open, isActive }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawer id="${DrawerId.OvershootWarn}" style="--magic-drawer-drag-overshoot: invalid">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const warningCalls = warnSpy.mock.calls.filter((call: unknown[]) =>
        call.some(
          (arg: unknown) =>
            typeof arg === 'string' &&
            arg.includes('--magic-drawer-drag-overshoot')
        )
      )
      expect(warningCalls.length).toBeGreaterThan(0)

      warnSpy.mockRestore()
    })
  })

  describe('rapid state changes', () => {
    it('rapid open/close does not break state', async () => {
      const screen = render(createRapidWrapper(DrawerId.RapidDrawer))

      await screen.getByTestId(TestId.RapidBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidWrapper(DrawerId.DoubleOpen))

      await screen.getByTestId(TestId.DoubleOpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidWrapper(DrawerId.DoubleClose))

      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()

      const dblCloseBtn = document.querySelector(
        `[data-test-id="${TestId.DoubleCloseBtn}"]`
      ) as HTMLElement
      dblCloseBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting closes the drawer', async () => {
      const container = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, close, isActive } = useMagicDrawer(DrawerId.UnmountDrawer)
          return { open, close, isActive }
        },
        data() {
          return { showDrawer: true }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="showDrawer = !showDrawer">Toggle</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawer v-if="showDrawer" id="${DrawerId.UnmountDrawer}">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      const toggleBtn = document.querySelector(
        `[data-test-id="${TestId.ToggleBtn}"]`
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('unmounting cleans up scroll lock', async () => {
      const container = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.CleanupScroll)
          return { open, isActive }
        },
        data() {
          return { showDrawer: true }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="showDrawer = !showDrawer">Toggle</button>
            <MagicDrawer
              v-if="showDrawer"
              id="${DrawerId.CleanupScroll}"
              :options="{ scrollLock: true }"
            >
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const toggleBtn = document.querySelector(
        `[data-test-id="${TestId.ToggleBtn}"]`
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.documentElement.style.overflow).not.toBe('hidden')
    })
  })

  describe('overshoot CSS variable parsing', () => {
    it('handles px overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootPx)
          return { open, isActive }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawer id="${DrawerId.OvershootPx}" style="--magic-drawer-drag-overshoot: 32px">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('handles rem overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer(DrawerId.OvershootRem)
          return { open, isActive }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicDrawer id="${DrawerId.OvershootRem}" style="--magic-drawer-drag-overshoot: 2rem">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('concurrent drawer instances', () => {
    it('opening multiple drawers simultaneously works', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const d1 = useMagicDrawer(DrawerId.Concurrent1)
          const d2 = useMagicDrawer(DrawerId.Concurrent2)
          const d3 = useMagicDrawer(DrawerId.Concurrent3)
          return {
            openAll: () => {
              d1.open()
              d2.open()
              d3.open()
            },
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
            <MagicDrawer id="${DrawerId.Concurrent1}"><div>1</div></MagicDrawer>
            <MagicDrawer id="${DrawerId.Concurrent2}"><div>2</div></MagicDrawer>
            <MagicDrawer id="${DrawerId.Concurrent3}"><div>3</div></MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenAll).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active3))
        .toHaveTextContent('true')
    })
  })
})
