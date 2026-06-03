import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicModalProvider from '../src/components/MagicModalProvider.vue'
import MagicModalTrigger from '../src/components/MagicModalTrigger.vue'
import MagicModalTeleport from '../src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../src/components/MagicModalContent.vue'
import { ModalId, TestId } from './enums'

function createModal(id: ModalId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTrigger, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
    template: `
      <MagicModalProvider id="${id}" :options="options">
        <MagicModalTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicModalTrigger>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent>
            <div data-test-id="${TestId.ModalContent}">Content</div>
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
}

describe('MagicModal - Rendering', () => {
  describe('trigger', () => {
    it('has .magic-modal-trigger class', () => {
      render(createModal(ModalId.RenderTrigger))
      expect(document.querySelector('.magic-modal-trigger')).not.toBeNull()
    })

    it('has data-active=false initially', () => {
      render(createModal(ModalId.RenderTriggerActive))
      expect(document.querySelector('.magic-modal-trigger')!.getAttribute('data-active')).toBe('false')
    })

    it('has data-disabled=false by default', () => {
      render(createModal(ModalId.RenderTriggerDisabled))
      expect(document.querySelector('.magic-modal-trigger')!.getAttribute('data-disabled')).toBe('false')
    })

    it('data-active becomes true when open', async () => {
      const screen = render(createModal(ModalId.RenderTriggerOpen))
      await open(screen)
      expect(document.querySelector('.magic-modal-trigger')!.getAttribute('data-active')).toBe('true')
    })
  })

  describe('content (closed)', () => {
    it('does not render when inactive', () => {
      render(createModal(ModalId.RenderContentClosed))
      expect(document.querySelector('.magic-modal-content')).toBeNull()
    })
  })

  describe('content (open)', () => {
    it('renders correct structure', async () => {
      const screen = render(createModal(ModalId.RenderContentOpen))
      await open(screen)

      const modal = document.querySelector('.magic-modal-content')
      expect(modal).not.toBeNull()
      expect(modal!.querySelector('.magic-modal-content__inner')).not.toBeNull()
    })

    it('sets data-id', async () => {
      const screen = render(createModal(ModalId.RenderDataId))
      await open(screen)
      expect(document.querySelector('.magic-modal-content')!.getAttribute('data-id')).toBe(ModalId.RenderDataId)
    })

    it('sets aria-modal', async () => {
      const screen = render(createModal(ModalId.RenderAriaModal))
      await open(screen)
      expect(document.querySelector('.magic-modal-content')!.getAttribute('aria-modal')).toBe('true')
    })

    it('inner uses dialog by default', async () => {
      const screen = render(createModal(ModalId.RenderTag))
      await open(screen)
      expect(document.querySelector('.magic-modal-content__inner')!.tagName.toLowerCase()).toBe('dialog')
    })

    it('renders slot content', async () => {
      const screen = render(createModal(ModalId.RenderSlot))
      await open(screen)
      await expect.element(page.getByTestId(TestId.ModalContent)).toBeInTheDocument()
    })
  })

  describe('backdrop', () => {
    it('renders when modal is open', async () => {
      const screen = render(createModal(ModalId.RenderBackdrop))
      await open(screen)
      expect(document.querySelector('.magic-modal-backdrop')).not.toBeNull()
    })
  })
})
