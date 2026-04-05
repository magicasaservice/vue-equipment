import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

function createWrapper(
  drawerId: string = 'api-drawer',
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive, snapTo, progress } =
        useMagicDrawer(drawerId)
      return { open, close, isActive, snapTo, progress }
    },
    template: `
      <div>
        <button data-testid="open-btn" @click="open">Open</button>
        <span data-testid="is-active">{{ isActive }}</span>
        <span data-testid="progress-x">{{ progress.x }}</span>
        <span data-testid="progress-y">{{ progress.y }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-testid="drawer-content" style="height: 200px; width: 100%;">
            <button data-testid="close-btn" @click="close">Close</button>
            Content
          </div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createMultiDrawerWrapper() {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const drawer1 = useMagicDrawer('drawer-1')
      const drawer2 = useMagicDrawer('drawer-2')
      return {
        open1: drawer1.open,
        close1: drawer1.close,
        isActive1: drawer1.isActive,
        open2: drawer2.open,
        close2: drawer2.close,
        isActive2: drawer2.isActive,
      }
    },
    template: `
      <div>
        <button data-testid="open-1" @click="open1">Open 1</button>
        <button data-testid="open-2" @click="open2">Open 2</button>
        <span data-testid="active-1">{{ isActive1 }}</span>
        <span data-testid="active-2">{{ isActive2 }}</span>
        <MagicDrawer id="drawer-1">
          <div>Drawer 1</div>
        </MagicDrawer>
        <MagicDrawer id="drawer-2">
          <div>Drawer 2</div>
        </MagicDrawer>
      </div>
    `,
  })
}

describe('MagicDrawer - Public API', () => {
  describe('open / close / isActive', () => {
    it('isActive is false initially', async () => {
      render(createWrapper())
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('open() sets isActive to true and drawer appears', async () => {
      const screen = render(createWrapper())
      await screen.getByTestId('open-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await nextTick()
      expect(document.querySelector('.magic-drawer')).not.toBeNull()
    })

    it('close() sets isActive to false', async () => {
      const screen = render(createWrapper())
      await screen.getByTestId('open-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      // Close via Escape key (drawer covers the page, can't click behind it)
      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('open/close cycle can be repeated', async () => {
      const screen = render(createWrapper())

      // First cycle
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      // Wait for leave transition
      await new Promise((r) => setTimeout(r, 400))
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')

      // Second cycle
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })
  })

  describe('multiple drawer instances', () => {
    it('drawers with different IDs are independent', async () => {
      const screen = render(createMultiDrawerWrapper())

      // Open drawer 1
      await screen.getByTestId('open-1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('false')

      // Close drawer 1 via Escape, then open drawer 2
      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await screen.getByTestId('open-2').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')

      // Close drawer 2
      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('false')
    })
  })

  describe('initial options', () => {
    it('initial.open opens drawer on mount', async () => {
      render(createWrapper('initial-drawer', { initial: { open: true } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
      expect(document.querySelector('.magic-drawer')).not.toBeNull()
    })

    it('initial.open with initial.transition false suppresses animation', async () => {
      render(
        createWrapper('no-transition-drawer', {
          initial: { open: true, transition: false },
        })
      )
      await nextTick()
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-drawer')).not.toBeNull()
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('snapTo', () => {
    it('snapTo emits without error when drawer is open', async () => {
      const wrapper = createWrapper('snap-drawer', {
        snapPoints: [0.5, 1],
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-drawer')).not.toBeNull()

      const { snapTo } = useMagicDrawer('snap-drawer')
      expect(() => snapTo(0.5)).not.toThrow()
    })
  })

  describe('progress', () => {
    it('progress values start at 0', async () => {
      render(createWrapper())

      await expect
        .element(page.getByTestId('progress-x'))
        .toHaveTextContent('0')
      await expect
        .element(page.getByTestId('progress-y'))
        .toHaveTextContent('0')
    })
  })
})
