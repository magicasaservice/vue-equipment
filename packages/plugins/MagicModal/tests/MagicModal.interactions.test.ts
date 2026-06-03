import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicModalProvider from '../src/components/MagicModalProvider.vue'
import MagicModalTrigger from '../src/components/MagicModalTrigger.vue'
import MagicModalTeleport from '../src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../src/components/MagicModalContent.vue'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

function createModal(id: ModalId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTrigger, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    setup() {
      const { isActive } = useMagicModal(id)
      return { isActive }
    },
    template: `
      <MagicModalProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModalTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicModalTrigger>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent>
            <div data-test-id="${TestId.ModalContent}" style="width: 300px; height: 200px; background: white;">Content</div>
          </MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
    data() { return { options } },
  })
}

function createDisabledTriggerModal(id: ModalId) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTrigger, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    setup() {
      const { isActive } = useMagicModal(id)
      return { isActive }
    },
    template: `
      <MagicModalProvider id="${id}">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModalTrigger :disabled="true">
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicModalTrigger>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent><div>Content</div></MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
  })
}

async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicModal - Interactions', () => {
  describe('trigger', () => {
    it('click opens modal', async () => {
      const screen = render(createModal(ModalId.Interact))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('click again closes modal', async () => {
      const screen = render(createModal(ModalId.InteractToggle))
      await open(screen)

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      // DOM click bypasses backdrop pointer-events
      ;(document.querySelector('.magic-modal-trigger') as HTMLElement).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('disabled trigger does not open modal', async () => {
      render(createDisabledTriggerModal(ModalId.InteractDisabled))

      // DOM click bypasses pointer-events: none on trigger; handler still checks disabled state
      ;(document.querySelector('.magic-modal-trigger') as HTMLElement).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })
  })

  describe('backdrop', () => {
    it('click closes modal', async () => {
      const screen = render(createModal(ModalId.Interact))
      await open(screen)

      const backdrop = document.querySelector('.magic-modal-backdrop') as HTMLElement
      expect(backdrop).not.toBeNull()
      await userEvent.click(backdrop, { position: { x: 5, y: 5 } })
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('content click does not close modal', async () => {
      const screen = render(createModal(ModalId.InteractContent))
      await open(screen)

      const content = document.querySelector(`[data-test-id="${TestId.ModalContent}"]`) as HTMLElement
      content.click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('keyboard', () => {
    it('Escape closes modal', async () => {
      const screen = render(createModal(ModalId.Key))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('keyListener.close: false disables Escape', async () => {
      const screen = render(createModal(ModalId.KeyDisabled, { keyListener: { close: false } }))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })
})
