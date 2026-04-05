import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

function createWrapper(
  drawerId: string,
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
        <button data-testid="open-btn" @click="open">Open</button>
        <span data-testid="is-active">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-testid="drawer-content" style="height: 200px; width: 100%;">Content</div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

// Wrapper with programmatic controls exposed as DOM-clickable buttons
function createRapidWrapper(drawerId: string) {
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
        <button data-testid="open-btn" @click="open">Open</button>
        <button data-testid="close-btn" @click="close">Close</button>
        <button data-testid="rapid-btn" @click="rapidToggle">Rapid</button>
        <button data-testid="double-open-btn" @click="doubleOpen">DblOpen</button>
        <button data-testid="double-close-btn" @click="openThenDoubleClose">DblClose</button>
        <span data-testid="is-active">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}">
          <div>Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

describe('MagicDrawer - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createWrapper('default-drawer'))
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      expect(document.querySelector('.magic-drawer')).not.toBeNull()

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })
  })

  describe('warning messages', () => {
    it('snapTo on closed drawer logs warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Use a wrapper that has snapTo exposed as a button click
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, close, isActive, snapTo } =
            useMagicDrawer('warn-snap')
          return {
            open,
            close,
            isActive,
            trySnap: () => snapTo(0.5),
          }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <button data-testid="snap-btn" @click="trySnap">Snap</button>
            <span data-testid="is-active">{{ isActive }}</span>
            <MagicDrawer id="warn-snap" :options="{ snapPoints: [0.5, 1] }">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await nextTick()

      // Snap while closed
      await screen.getByTestId('snap-btn').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const warningCalls = warnSpy.mock.calls.filter(
        (call) =>
          call.some(
            (arg) =>
              typeof arg === 'string' && arg.includes('[MagicDrawer]')
          ) &&
          call.some(
            (arg) =>
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
          const { open, isActive } = useMagicDrawer('overshoot-warn')
          return { open, isActive }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <span data-testid="is-active">{{ isActive }}</span>
            <MagicDrawer id="overshoot-warn" style="--magic-drawer-drag-overshoot: invalid">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const warningCalls = warnSpy.mock.calls.filter((call) =>
        call.some(
          (arg) =>
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
      const screen = render(createRapidWrapper('rapid-drawer'))

      // Click rapid button which does: open, close, open, close, open
      await screen.getByTestId('rapid-btn').click()
      await nextTick()
      await nextTick()

      // Should settle in the last state (open)
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidWrapper('double-open'))

      await screen.getByTestId('double-open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      // Should still be closable via Escape
      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidWrapper('double-close'))

      // Open first
      await screen.getByTestId('open-btn').click()
      await nextTick()

      // Double close (button calls close() twice via DOM click — behind drawer)
      const dblCloseBtn = document.querySelector(
        '[data-testid="double-close-btn"]'
      ) as HTMLElement
      dblCloseBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')

      // Should still be openable
      await screen.getByTestId('open-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting closes the drawer', async () => {
      const container = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, close, isActive } = useMagicDrawer('unmount-drawer')
          return { open, close, isActive }
        },
        data() {
          return { showDrawer: true }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <button data-testid="toggle-btn" @click="showDrawer = !showDrawer">Toggle</button>
            <span data-testid="is-active">{{ isActive }}</span>
            <MagicDrawer v-if="showDrawer" id="unmount-drawer">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      // Toggle-btn is behind the drawer, use DOM click
      const toggleBtn = document.querySelector(
        '[data-testid="toggle-btn"]'
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('unmounting cleans up scroll lock', async () => {
      const container = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer('cleanup-scroll')
          return { open, isActive }
        },
        data() {
          return { showDrawer: true }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <button data-testid="toggle-btn" @click="showDrawer = !showDrawer">Toggle</button>
            <MagicDrawer
              v-if="showDrawer"
              id="cleanup-scroll"
              :options="{ scrollLock: true }"
            >
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      // Unmount via DOM click
      const toggleBtn = document.querySelector(
        '[data-testid="toggle-btn"]'
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      // Body scroll should be unlocked after unmount
      const htmlOverflow = document.documentElement.style.overflow
      expect(htmlOverflow).not.toBe('hidden')
    })
  })

  describe('overshoot CSS variable parsing', () => {
    it('handles px overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer('overshoot-px')
          return { open, isActive }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <span data-testid="is-active">{{ isActive }}</span>
            <MagicDrawer id="overshoot-px" style="--magic-drawer-drag-overshoot: 32px">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('handles rem overshoot value correctly', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const { open, isActive } = useMagicDrawer('overshoot-rem')
          return { open, isActive }
        },
        template: `
          <div>
            <button data-testid="open-btn" @click="open">Open</button>
            <span data-testid="is-active">{{ isActive }}</span>
            <MagicDrawer id="overshoot-rem" style="--magic-drawer-drag-overshoot: 2rem">
              <div>Content</div>
            </MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('concurrent drawer instances', () => {
    it('opening multiple drawers simultaneously works', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawer },
        setup() {
          const d1 = useMagicDrawer('concurrent-1')
          const d2 = useMagicDrawer('concurrent-2')
          const d3 = useMagicDrawer('concurrent-3')
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
            <button data-testid="open-all" @click="openAll">Open All</button>
            <span data-testid="active-1">{{ isActive1 }}</span>
            <span data-testid="active-2">{{ isActive2 }}</span>
            <span data-testid="active-3">{{ isActive3 }}</span>
            <MagicDrawer id="concurrent-1"><div>1</div></MagicDrawer>
            <MagicDrawer id="concurrent-2"><div>2</div></MagicDrawer>
            <MagicDrawer id="concurrent-3"><div>3</div></MagicDrawer>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-all').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-3'))
        .toHaveTextContent('true')
    })
  })
})
