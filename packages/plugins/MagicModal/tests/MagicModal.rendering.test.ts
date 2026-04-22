import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  modalId: ModalId = ModalId.TestModal,
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
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="${TestId.ModalContent}">Modal Content</div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createWrapperWithBackdropSlot() {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close } = useMagicModal(ModalId.TestModalSlot)
      return { open, close }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <MagicModal id="${ModalId.TestModalSlot}">
          <template #backdrop>
            <div data-test-id="${TestId.CustomBackdrop}">Custom Backdrop</div>
          </template>
          <div data-test-id="${TestId.ModalContent}">Content</div>
        </MagicModal>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicModal - Rendering', () => {
  it('does not render when inactive', () => {
    render(createWrapper())
    expect(document.querySelector('.magic-modal')).toBeNull()
  })

  it('renders with correct class structure when opened', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal).not.toBeNull()
    expect(modal!.querySelector('.magic-modal__backdrop')).not.toBeNull()
    expect(modal!.querySelector('.magic-modal__content')).not.toBeNull()
  })

  it('sets data-id attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal!.getAttribute('data-id')).toBe(ModalId.TestModal)
  })

  it('sets aria-modal attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal!.getAttribute('aria-modal')).toBe('true')
  })

  it('uses dialog element by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const content = document.querySelector('.magic-modal__content')
    expect(content!.tagName.toLowerCase()).toBe('dialog')
  })

  it('uses div element when tag option is div', async () => {
    const screen = render(createWrapper(ModalId.TestModal, { tag: 'div' }))
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const content = document.querySelector('.magic-modal__content')
    expect(content!.tagName.toLowerCase()).toBe('div')
  })

  it('teleports to body by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.body.querySelector(':scope > .magic-modal')
    expect(modal).not.toBeNull()
  })

  it('renders backdrop when backdrop option is true (default)', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    expect(document.querySelector('.magic-modal__backdrop')).not.toBeNull()
  })

  it('does not render backdrop when backdrop option is false', async () => {
    const screen = render(createWrapper(ModalId.TestModal, { backdrop: false }))
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    expect(document.querySelector('.magic-modal__backdrop')).toBeNull()
  })

  it('renders default slot content', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId(TestId.ModalContent))
      .toBeInTheDocument()
  })

  it('renders backdrop slot content', async () => {
    const screen = render(createWrapperWithBackdropSlot())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId(TestId.CustomBackdrop))
      .toBeInTheDocument()
  })

  it('has fixed positioning', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal') as HTMLElement
    const style = window.getComputedStyle(modal)
    expect(style.position).toBe('fixed')
  })

  it('is centered with flexbox', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal') as HTMLElement
    const style = window.getComputedStyle(modal)
    expect(style.display).toBe('flex')
    expect(style.justifyContent).toBe('center')
    expect(style.alignItems).toBe('center')
  })
})
