import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'

function createWrapper(options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal('test-modal')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <button data-test-id="close-btn" @click="close">Close</button>
        <MagicModal id="test-modal" :options="options">
          <div data-test-id="modal-content">Modal Content</div>
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
      const { open, close } = useMagicModal('test-modal-slot')
      return { open, close }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <MagicModal id="test-modal-slot">
          <template #backdrop>
            <div data-test-id="custom-backdrop">Custom Backdrop</div>
          </template>
          <div data-test-id="modal-content">Content</div>
        </MagicModal>
      </div>
    `,
  })
}

describe('MagicModal - Rendering', () => {
  it('does not render when inactive', () => {
    render(createWrapper())
    expect(document.querySelector('.magic-modal')).toBeNull()
  })

  it('renders with correct class structure when opened', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal).not.toBeNull()
    expect(modal!.querySelector('.magic-modal__backdrop')).not.toBeNull()
    expect(modal!.querySelector('.magic-modal__content')).not.toBeNull()
  })

  it('sets data-id attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal!.getAttribute('data-id')).toBe('test-modal')
  })

  it('sets aria-modal attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal')
    expect(modal!.getAttribute('aria-modal')).toBe('true')
  })

  it('uses dialog element by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const content = document.querySelector('.magic-modal__content')
    expect(content!.tagName.toLowerCase()).toBe('dialog')
  })

  it('uses div element when tag option is div', async () => {
    const screen = render(createWrapper({ tag: 'div' }))
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const content = document.querySelector('.magic-modal__content')
    expect(content!.tagName.toLowerCase()).toBe('div')
  })

  it('teleports to body by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.body.querySelector(':scope > .magic-modal')
    expect(modal).not.toBeNull()
  })

  it('renders backdrop when backdrop option is true (default)', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const backdrop = document.querySelector('.magic-modal__backdrop')
    expect(backdrop).not.toBeNull()
  })

  it('does not render backdrop when backdrop option is false', async () => {
    const screen = render(createWrapper({ backdrop: false }))
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const backdrop = document.querySelector('.magic-modal__backdrop')
    expect(backdrop).toBeNull()
  })

  it('renders default slot content', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId('modal-content'))
      .toBeInTheDocument()
  })

  it('renders backdrop slot content', async () => {
    const screen = render(createWrapperWithBackdropSlot())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId('custom-backdrop'))
      .toBeInTheDocument()
  })

  it('has fixed positioning', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal') as HTMLElement
    const style = window.getComputedStyle(modal)
    expect(style.position).toBe('fixed')
  })

  it('is centered with flexbox', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const modal = document.querySelector('.magic-modal') as HTMLElement
    const style = window.getComputedStyle(modal)
    expect(style.display).toBe('flex')
    expect(style.justifyContent).toBe('center')
    expect(style.alignItems).toBe('center')
  })
})
