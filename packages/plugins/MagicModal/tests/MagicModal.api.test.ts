import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicModalProvider from '../src/components/MagicModalProvider.vue'
import MagicModalTeleport from '../src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../src/components/MagicModalContent.vue'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

function createModal(id: ModalId) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    setup() {
      const { open, close, isActive } = useMagicModal(id)
      return { open, close, isActive }
    },
    template: `
      <MagicModalProvider id="${id}">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent><div data-test-id="${TestId.ModalContent}">Content</div></MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
  })
}

describe('MagicModal - API', () => {
  describe('open / close / isActive', () => {
    it('isActive is false initially', () => {
      render(createModal(ModalId.ApiInitial))
      expect(document.querySelector(`[data-test-id="${TestId.IsActive}"]`)!.textContent).toBe('false')
    })

    it('open() sets isActive to true', async () => {
      const screen = render(createModal(ModalId.ApiOpen))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('close() sets isActive to false', async () => {
      const screen = render(createModal(ModalId.ApiClose))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      // DOM click bypasses backdrop pointer-events
      ;(document.querySelector(`[data-test-id="${TestId.CloseBtn}"]`) as HTMLElement).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('isActive reflects state', async () => {
      const screen = render(createModal(ModalId.ApiReflect))
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('multiple instances', () => {
    it('independent modals have independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicModalProvider, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
        setup() {
          const m1 = useMagicModal(ModalId.Multi1)
          const m2 = useMagicModal(ModalId.Multi2)
          return { open1: m1.open, open2: m2.open, isActive1: m1.isActive, isActive2: m2.isActive }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open1}" @click="open1">Open 1</button>
            <button data-test-id="${TestId.Open2}" @click="open2">Open 2</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <MagicModalProvider id="${ModalId.Multi1}">
              <MagicModalTeleport><MagicModalBackdrop /><MagicModalContent><div>1</div></MagicModalContent></MagicModalTeleport>
            </MagicModalProvider>
            <MagicModalProvider id="${ModalId.Multi2}">
              <MagicModalTeleport><MagicModalBackdrop /><MagicModalContent><div>2</div></MagicModalContent></MagicModalTeleport>
            </MagicModalProvider>
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
})
