import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

// ─── Factory ──────────────────────────────────────────────────────────────────

function createWrapper(modalId: ModalId) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal(modalId)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModal id="${modalId}">
          <div data-test-id="${TestId.ModalContent}">Content</div>
        </MagicModal>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicModal - API', () => {
  describe('open and close', () => {
    it('open() activates the modal', async () => {
      const screen = render(createWrapper(ModalId.ApiOpen))
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('close() deactivates the modal', async () => {
      const screen = render(createWrapper(ModalId.ApiClose))
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      // Close btn is behind modal, use DOM click
      const closeBtn = document.querySelector(
        `[data-test-id="${TestId.CloseBtn}"]`
      ) as HTMLElement
      closeBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })
  })

  describe('isActive', () => {
    it('isActive is false initially', async () => {
      render(createWrapper(ModalId.ApiInitial))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('isActive reflects open/close state', async () => {
      const screen = render(createWrapper(ModalId.ApiReflect))
      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('multiple instances', () => {
    it('independent modals have independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicModal },
        setup() {
          const m1 = useMagicModal(ModalId.Multi1)
          const m2 = useMagicModal(ModalId.Multi2)
          return {
            open1: m1.open,
            open2: m2.open,
            isActive1: m1.isActive,
            isActive2: m2.isActive,
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open1}" @click="open1">Open 1</button>
            <button data-test-id="${TestId.Open2}" @click="open2">Open 2</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <MagicModal id="${ModalId.Multi1}"><div>Modal 1</div></MagicModal>
            <MagicModal id="${ModalId.Multi2}"><div>Modal 2</div></MagicModal>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Open1).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('false')
    })
  })
})
