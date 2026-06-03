import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicModalProvider from '../src/components/MagicModalProvider.vue'
import MagicModalTeleport from '../src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../src/components/MagicModalContent.vue'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

function createModal(id: ModalId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    setup() {
      const { open, close, isActive } = useMagicModal(id)
      return { open, close, isActive }
    },
    template: `
      <MagicModalProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent><div data-test-id="${TestId.ModalContent}">Content</div></MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
    data() { return { options } },
  })
}

function createRapidModal(id: ModalId) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    setup() {
      const { open, close, isActive } = useMagicModal(id)
      function rapidToggle() { open(); close(); open(); close(); open() }
      function doubleOpen() { open(); open() }
      function doubleClose() { close(); close() }
      return { open, close, isActive, rapidToggle, doubleOpen, doubleClose }
    },
    template: `
      <MagicModalProvider id="${id}">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <button data-test-id="${TestId.RapidBtn}" @click="rapidToggle">Rapid</button>
        <button data-test-id="${TestId.DoubleOpenBtn}" @click="doubleOpen">DblOpen</button>
        <button data-test-id="${TestId.DoubleCloseBtn}" @click="doubleClose">DblClose</button>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent><div>Content</div></MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
  })
}

describe('MagicModal - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createModal(ModalId.Default))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })
  })

  describe('rapid state changes', () => {
    it('rapid open/close does not break state', async () => {
      const screen = render(createRapidModal(ModalId.Rapid))
      await screen.getByTestId(TestId.RapidBtn).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidModal(ModalId.DoubleOpen))
      await screen.getByTestId(TestId.DoubleOpenBtn).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidModal(ModalId.DoubleClose))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      ;(document.querySelector(`[data-test-id="${TestId.DoubleCloseBtn}"]`) as HTMLElement).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')

      ;(document.querySelector(`[data-test-id="${TestId.Trigger}"]`) as HTMLElement).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting closes the modal', async () => {
      const container = defineComponent({
        components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
        setup() {
          const { open, isActive } = useMagicModal(ModalId.Unmount)
          return { open, isActive }
        },
        data() { return { show: true } },
        template: `
          <div>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="show = !show">Toggle</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicModalProvider v-if="show" id="${ModalId.Unmount}">
              <MagicModalTeleport>
                <MagicModalBackdrop />
                <MagicModalContent><div>Content</div></MagicModalContent>
              </MagicModalTeleport>
            </MagicModalProvider>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-modal-content')).not.toBeNull()

      ;(document.querySelector(`[data-test-id="${TestId.ToggleBtn}"]`) as HTMLElement).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-modal-content')).toBeNull()
    })

    it('unmounting cleans up scroll lock', async () => {
      const container = defineComponent({
        components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
        setup() {
          const { open } = useMagicModal(ModalId.CleanupScroll)
          return { open }
        },
        data() { return { show: true } },
        template: `
          <div>
            <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="show = !show">Toggle</button>
            <MagicModalProvider v-if="show" id="${ModalId.CleanupScroll}" :options="{ scrollLock: true }">
              <MagicModalTeleport>
                <MagicModalBackdrop />
                <MagicModalContent><div>Content</div></MagicModalContent>
              </MagicModalTeleport>
            </MagicModalProvider>
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

  describe('concurrent instances', () => {
    it('opening multiple modals simultaneously works', async () => {
      const wrapper = defineComponent({
        components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
        setup() {
          const m1 = useMagicModal(ModalId.Concurrent1)
          const m2 = useMagicModal(ModalId.Concurrent2)
          const m3 = useMagicModal(ModalId.Concurrent3)
          return {
            openAll: () => { m1.open(); m2.open(); m3.open() },
            isActive1: m1.isActive,
            isActive2: m2.isActive,
            isActive3: m3.isActive,
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenAll}" @click="openAll">Open All</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <span data-test-id="${TestId.Active3}">{{ isActive3 }}</span>
            <MagicModalProvider id="${ModalId.Concurrent1}">
              <MagicModalTeleport><MagicModalBackdrop /><MagicModalContent><div>1</div></MagicModalContent></MagicModalTeleport>
            </MagicModalProvider>
            <MagicModalProvider id="${ModalId.Concurrent2}">
              <MagicModalTeleport><MagicModalBackdrop /><MagicModalContent><div>2</div></MagicModalContent></MagicModalTeleport>
            </MagicModalProvider>
            <MagicModalProvider id="${ModalId.Concurrent3}">
              <MagicModalTeleport><MagicModalBackdrop /><MagicModalContent><div>3</div></MagicModalContent></MagicModalTeleport>
            </MagicModalProvider>
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
