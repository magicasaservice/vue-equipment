import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  drawerId: DrawerId = DrawerId.ApiDrawer,
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
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <span data-test-id="${TestId.ProgressX}">{{ progress.x }}</span>
        <span data-test-id="${TestId.ProgressY}">{{ progress.y }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-test-id="${TestId.DrawerContent}" style="height: 200px; width: 100%;">
            <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
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
      const drawer1 = useMagicDrawer(DrawerId.Drawer1)
      const drawer2 = useMagicDrawer(DrawerId.Drawer2)
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
        <button data-test-id="${TestId.Open1}" @click="open1">Open 1</button>
        <button data-test-id="${TestId.Open2}" @click="open2">Open 2</button>
        <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
        <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
        <MagicDrawer id="${DrawerId.Drawer1}">
          <div>Drawer 1</div>
        </MagicDrawer>
        <MagicDrawer id="${DrawerId.Drawer2}">
          <div>Drawer 2</div>
        </MagicDrawer>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDrawer - Public API', () => {
  describe('open / close / isActive', () => {
    it('isActive is false initially', async () => {
      render(createWrapper())
      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('open() sets isActive to true and drawer appears', async () => {
      const screen = render(createWrapper())
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('close() sets isActive to false', async () => {
      const screen = render(createWrapper())
      await screen.getByTestId(TestId.OpenBtn).click()
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

    it('open/close cycle can be repeated', async () => {
      const screen = render(createWrapper())

      // First cycle
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))
      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')

      // Second cycle
      await screen.getByTestId(TestId.OpenBtn).click()
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

  describe('multiple drawer instances', () => {
    it('drawers with different IDs are independent', async () => {
      const screen = render(createMultiDrawerWrapper())

      await screen.getByTestId(TestId.Open1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('false')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await screen.getByTestId(TestId.Open2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('false')
    })
  })

  describe('initial options', () => {
    it('initial.open opens drawer on mount', async () => {
      render(createWrapper(DrawerId.InitialDrawer, { initial: { open: true } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('initial.open with initial.transition false suppresses animation', async () => {
      render(
        createWrapper(DrawerId.NoTransitionDrawer, {
          initial: { open: true, transition: false },
        })
      )
      await nextTick()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('snapTo', () => {
    it('snapTo emits without error when drawer is open', async () => {
      const screen = render(
        createWrapper(DrawerId.SnapDrawer, { snapPoints: [0.5, 1] })
      )
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      const { snapTo } = useMagicDrawer(DrawerId.SnapDrawer)
      expect(() => snapTo(0.5)).not.toThrow()
    })
  })

  describe('progress', () => {
    it('progress values start at 0', async () => {
      render(createWrapper())

      await expect
        .element(page.getByTestId(TestId.ProgressX))
        .toHaveTextContent('0')
      await expect
        .element(page.getByTestId(TestId.ProgressY))
        .toHaveTextContent('0')
    })
  })
})
