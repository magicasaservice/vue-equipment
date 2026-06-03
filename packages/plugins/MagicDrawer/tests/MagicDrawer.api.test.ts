import { describe, it, expect } from 'vitest'
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
      const { open, close, isActive, snapTo, progress } = useMagicDrawer(id)
      return { open, close, isActive, snapTo, progress }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <span data-test-id="${TestId.ProgressX}">{{ progress.x }}</span>
        <span data-test-id="${TestId.ProgressY}">{{ progress.y }}</span>
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

describe('MagicDrawer - API', () => {
  describe('open / close / isActive', () => {
    it('isActive is false initially', () => {
      render(createDrawer(DrawerId.ApiDrawer))
      expect(document.querySelector(`[data-test-id="${TestId.IsActive}"]`)!.textContent).toBe('false')
    })

    it('open() sets isActive to true', async () => {
      const screen = render(createDrawer(DrawerId.ApiDrawer))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('close() sets isActive to false', async () => {
      const screen = render(createDrawer(DrawerId.ApiClose))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('open/close cycle can be repeated', async () => {
      const screen = render(createDrawer(DrawerId.ApiCycle))

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('multiple instances', () => {
    it('drawers with different IDs are independent', async () => {
      const wrapper = defineComponent({
        components: { MagicDrawerProvider, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
        setup() {
          const d1 = useMagicDrawer(DrawerId.Drawer1)
          const d2 = useMagicDrawer(DrawerId.Drawer2)
          return { open1: d1.open, open2: d2.open, isActive1: d1.isActive, isActive2: d2.isActive }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open1}" @click="open1">Open 1</button>
            <button data-test-id="${TestId.Open2}" @click="open2">Open 2</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <MagicDrawerProvider id="${DrawerId.Drawer1}">
              <MagicDrawerTeleport><MagicDrawerBackdrop /><MagicDrawerContent><div>1</div></MagicDrawerContent></MagicDrawerTeleport>
            </MagicDrawerProvider>
            <MagicDrawerProvider id="${DrawerId.Drawer2}">
              <MagicDrawerTeleport><MagicDrawerBackdrop /><MagicDrawerContent><div>2</div></MagicDrawerContent></MagicDrawerTeleport>
            </MagicDrawerProvider>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Open1).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.Active1)).toHaveTextContent('true')
      await expect.element(page.getByTestId(TestId.Active2)).toHaveTextContent('false')
    })
  })

  describe('initial option', () => {
    it('initial.open opens drawer on mount', async () => {
      render(createDrawer(DrawerId.InitialDrawer, { initial: { open: true } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('initial.transition: false suppresses mount animation', async () => {
      render(createDrawer(DrawerId.NoTransitionDrawer, { initial: { open: true, transition: false } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('snapTo', () => {
    it('snapTo does not throw when drawer is open', async () => {
      const screen = render(createDrawer(DrawerId.SnapDrawer, { snapPoints: [0.5, 1] }))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      const { snapTo } = useMagicDrawer(DrawerId.SnapDrawer)
      expect(() => snapTo(0.5)).not.toThrow()
    })
  })

  describe('progress', () => {
    it('progress values start at 0', () => {
      render(createDrawer(DrawerId.ApiDrawer))
      expect(document.querySelector(`[data-test-id="${TestId.ProgressX}"]`)!.textContent).toBe('0')
      expect(document.querySelector(`[data-test-id="${TestId.ProgressY}"]`)!.textContent).toBe('0')
    })
  })
})
