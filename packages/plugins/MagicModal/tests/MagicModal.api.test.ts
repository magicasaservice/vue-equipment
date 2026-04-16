import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'

function createWrapper(modalId: string) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal(modalId)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <button data-test-id="close-btn" @click="close">Close</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicModal id="${modalId}">
          <div data-test-id="modal-content">Content</div>
        </MagicModal>
      </div>
    `,
  })
}

describe('MagicModal - API', () => {
  describe('open and close', () => {
    it('open() activates the modal', async () => {
      const screen = render(createWrapper('api-open'))
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('close() deactivates the modal', async () => {
      const screen = render(createWrapper('api-close'))
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      // Close btn is behind modal, use DOM click
      const closeBtn = document.querySelector(
        '[data-test-id="close-btn"]'
      ) as HTMLElement
      closeBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })
  })

  describe('isActive', () => {
    it('isActive is false initially', async () => {
      render(createWrapper('api-initial'))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('isActive reflects open/close state', async () => {
      const screen = render(createWrapper('api-reflect'))
      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')

      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('multiple instances', () => {
    it('independent modals have independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicModal },
        setup() {
          const m1 = useMagicModal('multi-1')
          const m2 = useMagicModal('multi-2')
          return {
            open1: m1.open,
            open2: m2.open,
            isActive1: m1.isActive,
            isActive2: m2.isActive,
          }
        },
        template: `
          <div>
            <button data-test-id="open-1" @click="open1">Open 1</button>
            <button data-test-id="open-2" @click="open2">Open 2</button>
            <span data-test-id="active-1">{{ isActive1 }}</span>
            <span data-test-id="active-2">{{ isActive2 }}</span>
            <MagicModal id="multi-1"><div>Modal 1</div></MagicModal>
            <MagicModal id="multi-2"><div>Modal 2</div></MagicModal>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-1').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('false')
    })
  })
})
