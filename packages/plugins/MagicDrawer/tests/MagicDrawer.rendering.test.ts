import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  drawerId: DrawerId = DrawerId.TestDrawer,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer(drawerId)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-test-id="${TestId.DrawerContent}">Drawer Content</div>
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
      const { open, close } = useMagicDrawer(DrawerId.TestDrawerSlot)
      return { open, close }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <MagicDrawer id="${DrawerId.TestDrawerSlot}">
          <template #backdrop>
            <div data-test-id="${TestId.CustomBackdrop}">Custom Backdrop</div>
          </template>
          <div data-test-id="${TestId.DrawerContent}">Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDrawer - Rendering', () => {
  it('does not render when inactive', () => {
    render(createWrapper())
    expect(document.querySelector('.magic-drawer')).toBeNull()
  })

  it('renders with correct class structure when opened', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
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
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-id')).toBe(DrawerId.TestDrawer)
  })

  it('sets data-position attribute to bottom by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-position')).toBe('bottom')
  })

  it('sets aria-modal attribute', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('aria-modal')).toBe('true')
  })

  it('uses dialog element by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drag = document.querySelector('.magic-drawer__drag')
    expect(drag!.tagName.toLowerCase()).toBe('dialog')
  })

  it('uses div element when tag option is div', async () => {
    const screen = render(createWrapper(DrawerId.TestDrawer, { tag: 'div' }))
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drag = document.querySelector('.magic-drawer__drag')
    expect(drag!.tagName.toLowerCase()).toBe('div')
  })

  it('teleports to body by default', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.body.querySelector(':scope > .magic-drawer')
    expect(drawer).not.toBeNull()
  })

  it('renders backdrop when backdrop option is true (default)', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    expect(document.querySelector('.magic-drawer__backdrop')).not.toBeNull()
  })

  it('does not render backdrop when backdrop option is false', async () => {
    const screen = render(createWrapper(DrawerId.TestDrawer, { backdrop: false }))
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    expect(document.querySelector('.magic-drawer__backdrop')).toBeNull()
  })

  it('renders default slot content', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    await expect
      .element(page.getByTestId(TestId.DrawerContent))
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

  it('sets data-disabled attribute', async () => {
    const screen = render(createWrapper(DrawerId.TestDrawer, { disabled: true }))
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-disabled')).toBe('true')
  })

  it('sets data-dragging to false when not dragging', async () => {
    const screen = render(createWrapper())
    await screen.getByTestId(TestId.OpenBtn).click()
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.magic-drawer')
    expect(drawer!.getAttribute('data-dragging')).toBe('false')
  })
})
