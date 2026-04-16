import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'

function createWrapper(options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal('interact-modal')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicModal id="interact-modal" :options="options">
          <div data-test-id="modal-content" style="width: 300px; height: 200px; background: white;">
            Modal Content
          </div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createCustomKeyWrapper(keys: string[] | false) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal('key-modal')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicModal id="key-modal" :options="{ keyListener: { close: keys } }">
          <div>Content</div>
        </MagicModal>
      </div>
    `,
    data() {
      return { keys }
    },
  })
}

async function openModal(screen: ReturnType<typeof render>) {
  await screen.getByTestId('open-btn').click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicModal - Interactions', () => {
  describe('backdrop click', () => {
    it('clicking backdrop closes the modal', async () => {
      const screen = render(createWrapper())
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      // Pointer capture requires real browser interaction.
      // Click top-left corner of root modal div to avoid hitting centered content.
      const modal = document.querySelector('.magic-modal') as HTMLElement
      expect(modal).not.toBeNull()
      await userEvent.click(modal, { position: { x: 5, y: 5 } })
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('clicking modal content does not close', async () => {
      const screen = render(createWrapper())
      await openModal(screen)

      const content = document.querySelector(
        '[data-test-id="modal-content"]'
      ) as HTMLElement
      content.click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('no backdrop click when backdrop is false', async () => {
      const screen = render(createWrapper({ backdrop: false }))
      await openModal(screen)

      const backdrop = document.querySelector('.magic-modal__backdrop')
      expect(backdrop).toBeNull()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('keyboard interactions', () => {
    it('pressing Escape closes the modal (default)', async () => {
      const screen = render(createWrapper())
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('keyListener.close: false disables keyboard close', async () => {
      const screen = render(createCustomKeyWrapper(false))
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })
})
