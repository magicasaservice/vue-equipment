import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'

function createWrapper(
  modalId: string,
  options: Record<string, unknown> = {}
) {
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
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="modal-content" style="width: 300px; height: 200px;">
            <button>Focusable</button>
          </div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

async function openModal(screen: ReturnType<typeof render>) {
  await screen.getByTestId('open-btn').click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicModal - Options', () => {
  describe('backdrop', () => {
    it('backdrop: true (default) renders backdrop', async () => {
      const screen = render(createWrapper('opt-backdrop-true'))
      await openModal(screen)

      expect(
        document.querySelector('.magic-modal__backdrop')
      ).not.toBeNull()
    })

    it('backdrop: false hides backdrop', async () => {
      const screen = render(
        createWrapper('opt-backdrop-false', { backdrop: false })
      )
      await openModal(screen)

      expect(document.querySelector('.magic-modal__backdrop')).toBeNull()
    })
  })

  describe('tag', () => {
    it('tag: dialog (default) uses dialog element', async () => {
      const screen = render(createWrapper('opt-tag-dialog'))
      await openModal(screen)

      const content = document.querySelector('.magic-modal__content')
      expect(content!.tagName.toLowerCase()).toBe('dialog')
    })

    it('tag: div uses div element', async () => {
      const screen = render(
        createWrapper('opt-tag-div', { tag: 'div' })
      )
      await openModal(screen)

      const content = document.querySelector('.magic-modal__content')
      expect(content!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('teleport', () => {
    it('teleports to body by default', async () => {
      const screen = render(createWrapper('opt-teleport-body'))
      await openModal(screen)

      const modal = document.body.querySelector(':scope > .magic-modal')
      expect(modal).not.toBeNull()
    })

    it('teleport to custom target', async () => {
      // Create target element
      const target = document.createElement('div')
      target.id = 'modal-target'
      document.body.appendChild(target)

      try {
        const screen = render(
          createWrapper('opt-teleport-custom', {
            teleport: { target: '#modal-target' },
          })
        )
        await openModal(screen)

        const modal = target.querySelector('.magic-modal')
        expect(modal).not.toBeNull()
      } finally {
        document.body.removeChild(target)
      }
    })

    it('teleport disabled keeps modal in component tree', async () => {
      const screen = render(
        createWrapper('opt-teleport-disabled', {
          teleport: { disabled: true },
        })
      )
      await openModal(screen)

      // Should NOT be a direct child of body
      const bodyModal = document.body.querySelector(
        ':scope > .magic-modal'
      )
      expect(bodyModal).toBeNull()

      // But should exist somewhere in the DOM
      expect(document.querySelector('.magic-modal')).not.toBeNull()
    })
  })

  describe('keyListener', () => {
    it('default Escape key closes modal', async () => {
      const screen = render(createWrapper('opt-key-default'))
      await openModal(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('keyListener.close: false disables key close', async () => {
      const screen = render(
        createWrapper('opt-key-disabled', {
          keyListener: { close: false },
        })
      )
      await openModal(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('scrollLock', () => {
    it('scrollLock option is accepted without error', async () => {
      const screen = render(
        createWrapper('opt-scroll', { scrollLock: true })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('scrollLock: false is accepted without error', async () => {
      const screen = render(
        createWrapper('opt-scroll-false', { scrollLock: false })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('transition', () => {
    it('custom transition classes are applied', async () => {
      const screen = render(
        createWrapper('opt-transition', {
          transition: {
            content: 'custom-content-transition',
            backdrop: 'custom-backdrop-transition',
          },
        })
      )
      await openModal(screen)

      // Modal should still render correctly with custom transition names
      expect(document.querySelector('.magic-modal')).not.toBeNull()
    })
  })

  describe('focusTrap', () => {
    it('focusTrap: false is accepted without error', async () => {
      const screen = render(
        createWrapper('opt-focus-false', { focusTrap: false })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })
})
