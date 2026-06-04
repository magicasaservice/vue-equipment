import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
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
            <div data-test-id="${TestId.ModalContent}" style="width: 300px; height: 200px;"><button>Focusable</button></div>
          </MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
    data() { return { options } },
  })
}

async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicModal - Options', () => {
  describe('tag', () => {
    it('tag: dialog (default) uses dialog element', async () => {
      const screen = render(createModal(ModalId.OptTagDialog))
      await open(screen)
      expect(document.querySelector('.magic-modal-content__inner')!.tagName.toLowerCase()).toBe('dialog')
    })

    it('tag: div uses div element', async () => {
      const screen = render(createModal(ModalId.OptTagDiv, { tag: 'div' }))
      await open(screen)
      expect(document.querySelector('.magic-modal-content__inner')!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('teleport', () => {
    it('teleports to body by default', async () => {
      const screen = render(createModal(ModalId.OptTeleportBody))
      await open(screen)
      expect(document.body.querySelector(':scope > .magic-modal-content')).not.toBeNull()
    })

    it('teleport to custom target', async () => {
      const target = document.createElement('div')
      target.id = 'modal-target'
      document.body.appendChild(target)

      try {
        const screen = render(createModal(ModalId.OptTeleportCustom, { teleport: { target: '#modal-target' } }))
        await open(screen)
        expect(target.querySelector('.magic-modal-content')).not.toBeNull()
      } finally {
        document.body.removeChild(target)
      }
    })

    it('teleport disabled keeps modal in component tree', async () => {
      const screen = render(createModal(ModalId.OptTeleportDisabled, { teleport: { disabled: true } }))
      await open(screen)
      expect(document.body.querySelector(':scope > .magic-modal-content')).toBeNull()
      expect(document.querySelector('.magic-modal-content')).not.toBeNull()
    })
  })

  describe('options reactivity', () => {
    it("changing tag from 'dialog' to 'div' updates .magic-modal-content__inner tag", async () => {
      const options = ref({ tag: 'dialog' as 'dialog' | 'div' })

      const wrapper = defineComponent({
        components: { MagicModalProvider, MagicModalTrigger, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
        setup() {
          const { isActive } = useMagicModal(ModalId.ReactivityTag)
          return { isActive, options }
        },
        template: `
          <MagicModalProvider id="${ModalId.ReactivityTag}" :options="options">
            <MagicModalTrigger>
              <button data-test-id="${TestId.Trigger}">Open</button>
            </MagicModalTrigger>
            <MagicModalTeleport>
              <MagicModalBackdrop />
              <MagicModalContent>
                <div style="width: 300px; height: 200px;"><button>Focusable</button></div>
              </MagicModalContent>
            </MagicModalTeleport>
          </MagicModalProvider>
        `,
      })

      const screen = render(wrapper)
      await open(screen)

      expect(document.querySelector('.magic-modal-content__inner')!.tagName.toLowerCase()).toBe('dialog')

      options.value = { tag: 'div' }
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-modal-content__inner')!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('keyListener', () => {
    it('default Escape key closes modal', async () => {
      const { userEvent } = await import('vitest/browser')
      const screen = render(createModal(ModalId.OptKeyDefault))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('keyListener.close: false disables Escape', async () => {
      const { userEvent } = await import('vitest/browser')
      const screen = render(createModal(ModalId.OptKeyDisabled, { keyListener: { close: false } }))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('scrollLock', () => {
    it('scrollLock: true is accepted without error', async () => {
      const screen = render(createModal(ModalId.OptScroll, { scrollLock: true }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('scrollLock: false is accepted without error', async () => {
      const screen = render(createModal(ModalId.OptScrollFalse, { scrollLock: false }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('transition', () => {
    it('custom transition names are accepted without error', async () => {
      const screen = render(createModal(ModalId.OptTransition, { transition: { content: 'custom-content', backdrop: 'custom-backdrop' } }))
      await open(screen)
      expect(document.querySelector('.magic-modal-content')).not.toBeNull()
    })
  })

  describe('focusTrap', () => {
    it('focusTrap: false is accepted without error', async () => {
      const screen = render(createModal(ModalId.OptFocusFalse, { focusTrap: false }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })
})
