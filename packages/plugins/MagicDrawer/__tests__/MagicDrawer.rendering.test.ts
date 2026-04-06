import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

// Helper to render MagicDrawer inside a parent that can control it
function createWrapper(options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer('test-drawer')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-testid="open-btn" @click="open">Open</button>
        <button data-testid="close-btn" @click="close">Close</button>
        <MagicDrawer id="test-drawer" :options="options">
          <div data-testid="drawer-content">Drawer Content</div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createWrapperWithBackdropSlot() {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close } = useMagicDrawer('test-drawer-slot')
      return { open, close }
    },
    template: `
      <div>
        <button data-testid="open-btn" @click="open">Open</button>
        <MagicDrawer id="test-drawer-slot">
          <template #backdrop>
            <div data-testid="custom-backdrop">Custom Backdrop</div>
          </template>
          <div data-testid="drawer-content">Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

describe('MagicDrawer - Rendering', () => {
  it('does not render when inactive', () => {
    render(createWrapper())
    // Drawer should not be in the DOM when closed
    expect(
      document.querySelector('.magic-drawer')
    ).toBeNull()
  })

  it('renders with correct class structure when opened', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer).not.toBeNull()
    expect(drawer!.querySelector('.magic-drawer__backdrop')).not.toBeNull()
    expect(drawer!.querySelector('.magic-drawer__wrapper')).not.toBeNull()
    expect(drawer!.querySelector('.magic-drawer__content')).not.toBeNull()
    expect(drawer!.querySelector('.magic-drawer__drag')).not.toBeNull()
  })

  it('sets data-id attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-id')).toBe('test-drawer')
  })

  it('sets data-position attribute to bottom by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-position')).toBe('bottom')
  })

  it('sets aria-modal attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('aria-modal')).toBe('true')
  })

  it('uses dialog element by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drag = document.querySelector('.magic-drawer__drag')
    expect(drag!.tagName.toLowerCase()).toBe('dialog')
  })

  it('uses div element when tag option is div', async () => {
    const screen = render(createWrapper({ tag: 'div' }))
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drag = document.querySelector('.magic-drawer__drag')
    expect(drag!.tagName.toLowerCase()).toBe('div')
  })

  it('teleports to body by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    // The drawer should be a direct child of body (via teleport)
    const drawer = document.body.querySelector(':scope > .magic-drawer')
    expect(drawer).not.toBeNull()
  })

  it('renders backdrop when backdrop option is true (default)', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const backdrop = document.querySelector('.magic-drawer__backdrop')
    expect(backdrop).not.toBeNull()
  })

  it('does not render backdrop when backdrop option is false', async () => {
    const screen = render(createWrapper({ backdrop: false }))
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const backdrop = document.querySelector('.magic-drawer__backdrop')
    expect(backdrop).toBeNull()
  })

  it('renders default slot content', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId('drawer-content'))
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

  it('sets data-disabled attribute', async () => {
    const screen = render(createWrapper({ disabled: true }))
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-disabled')).toBe('true')
  })

  it('sets data-dragging to false when not dragging', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId('open-btn').click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-dragging')).toBe('false')
  })
})
