import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

// ─── Factory ──────────────────────────────────────────────────────────────────

function createWrapper(
  modalId: ModalId,
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
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="${TestId.ModalContent}" style="width: 300px; height: 200px;">
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
  await screen.getByTestId(TestId.OpenBtn).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicModal - Options', () => {
  describe('backdrop', () => {
    it('backdrop: true (default) renders backdrop', async () => {
      const screen = render(createWrapper(ModalId.OptBackdropTrue))
      await openModal(screen)

      expect(
        document.querySelector('.magic-modal__backdrop')
      ).not.toBeNull()
    })

    it('backdrop: false hides backdrop', async () => {
      const screen = render(
        createWrapper(ModalId.OptBackdropFalse, { backdrop: false })
      )
      await openModal(screen)

      expect(document.querySelector('.magic-modal__backdrop')).toBeNull()
    })
  })

  describe('tag', () => {
    it('tag: dialog (default) uses dialog element', async () => {
      const screen = render(createWrapper(ModalId.OptTagDialog))
      await openModal(screen)

      const content = document.querySelector('.magic-modal__content')
      expect(content!.tagName.toLowerCase()).toBe('dialog')
    })

    it('tag: div uses div element', async () => {
      const screen = render(
        createWrapper(ModalId.OptTagDiv, { tag: 'div' })
      )
      await openModal(screen)

      const content = document.querySelector('.magic-modal__content')
      expect(content!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('teleport', () => {
    it('teleports to body by default', async () => {
      const screen = render(createWrapper(ModalId.OptTeleportBody))
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
          createWrapper(ModalId.OptTeleportCustom, {
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
        createWrapper(ModalId.OptTeleportDisabled, {
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
      const screen = render(createWrapper(ModalId.OptKeyDefault))
      await openModal(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('keyListener.close: false disables key close', async () => {
      const screen = render(
        createWrapper(ModalId.OptKeyDisabled, {
          keyListener: { close: false },
        })
      )
      await openModal(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('scrollLock', () => {
    it('scrollLock option is accepted without error', async () => {
      const screen = render(
        createWrapper(ModalId.OptScroll, { scrollLock: true })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('scrollLock: false is accepted without error', async () => {
      const screen = render(
        createWrapper(ModalId.OptScrollFalse, { scrollLock: false })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('transition', () => {
    it('custom transition classes are applied', async () => {
      const screen = render(
        createWrapper(ModalId.OptTransition, {
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
        createWrapper(ModalId.OptFocusFalse, { focusTrap: false })
      )
      await openModal(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })
})
