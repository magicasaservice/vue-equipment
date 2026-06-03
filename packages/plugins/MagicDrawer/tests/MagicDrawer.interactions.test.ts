import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTrigger from '../src/components/MagicDrawerTrigger.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

function createDrawer(id: DrawerId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const { isActive } = useMagicDrawer(id)
      return { isActive }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawerTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicDrawerTrigger>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div data-test-id="${TestId.DrawerContent}" style="height: 300px; width: 100%; background: white;">Content</div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
    data() { return { options } },
  })
}

function createDisabledDrawer(id: DrawerId) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const { isActive } = useMagicDrawer(id)
      return { isActive }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="{ disabled: true }">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawerTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicDrawerTrigger>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div data-test-id="${TestId.DrawerContent}" style="height: 300px;">Content</div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
  })
}

async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicDrawer - Interactions', () => {
  describe('trigger', () => {
    it('click opens drawer', async () => {
      const screen = render(createDrawer(DrawerId.Interact))
      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('click again closes drawer', async () => {
      const screen = render(createDrawer(DrawerId.InteractToggle))
      await open(screen)

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')

      // DOM click bypasses backdrop pointer-events
      ;(document.querySelector('.magic-drawer-trigger') as HTMLElement).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })
  })

  describe('backdrop', () => {
    it('click closes drawer', async () => {
      const screen = render(createDrawer(DrawerId.Interact))
      await open(screen)

      const backdrop = document.querySelector('.magic-drawer-backdrop') as HTMLElement
      expect(backdrop).not.toBeNull()
      backdrop.click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('content click does not close drawer', async () => {
      const screen = render(createDrawer(DrawerId.InteractContent))
      await open(screen)

      ;(document.querySelector(`[data-test-id="${TestId.DrawerContent}"]`) as HTMLElement).click()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('has pointer-events none when disabled', async () => {
      const screen = render(createDisabledDrawer(DrawerId.Disabled))
      await open(screen)

      const backdrop = document.querySelector('.magic-drawer-backdrop') as HTMLElement
      expect(window.getComputedStyle(backdrop).pointerEvents).toBe('none')
    })
  })

  describe('keyboard', () => {
    it('Escape closes drawer', async () => {
      const screen = render(createDrawer(DrawerId.Key))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('false')
    })

    it('keyListener.close: false disables Escape', async () => {
      const screen = render(createDrawer(DrawerId.KeyDisabled, { keyListener: { close: false } }))
      await open(screen)

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('drag', () => {
    it('pointerdown + pointermove sets data-dragging to true', async () => {
      const screen = render(createDrawer(DrawerId.InteractDrag))
      await open(screen)

      const drag = document.querySelector('.magic-drawer-content__drag') as HTMLElement
      drag.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 300, bubbles: true, pointerId: 1 }))
      drag.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 350, bubbles: true, pointerId: 1 }))
      await nextTick()

      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-dragging')).toBe('true')

      drag.dispatchEvent(new PointerEvent('pointerup', { clientX: 200, clientY: 350, bubbles: true, pointerId: 1 }))
      await nextTick()
    })

    it('data-dragged becomes true after drag', async () => {
      const screen = render(createDrawer(DrawerId.InteractDragged))
      await open(screen)

      const drawer = document.querySelector('.magic-drawer-content')!
      expect(drawer.getAttribute('data-dragged')).toBe('false')

      const drag = document.querySelector('.magic-drawer-content__drag') as HTMLElement
      drag.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 300, screenX: 200, screenY: 300, bubbles: true, pointerId: 1, isPrimary: true }))
      await new Promise((r) => setTimeout(r, 10))

      document.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 400, screenX: 200, screenY: 400, bubbles: true, pointerId: 1, isPrimary: true }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(drawer.getAttribute('data-dragged')).toBe('true')

      document.dispatchEvent(new PointerEvent('pointerup', { clientX: 200, clientY: 400, bubbles: true, pointerId: 1, isPrimary: true }))
    })

    it('disabled drawer does not respond to drag', async () => {
      const screen = render(createDisabledDrawer(DrawerId.InteractDisabledDrag))
      await open(screen)

      const drag = document.querySelector('.magic-drawer-content__drag') as HTMLElement
      drag.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 300, bubbles: true, pointerId: 1 }))
      drag.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 500, bubbles: true, pointerId: 1 }))
      await nextTick()

      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-dragging')).toBe('false')
    })

    it('preventDragClose keeps drawer open after swipe', async () => {
      const screen = render(createDrawer(DrawerId.PreventDragClose, { preventDragClose: true }))
      await open(screen)

      const drag = document.querySelector('.magic-drawer-content__drag') as HTMLElement
      drag.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 200, bubbles: true, pointerId: 1 }))
      for (let y = 200; y <= 600; y += 50) {
        drag.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: y, bubbles: true, pointerId: 1 }))
      }
      drag.dispatchEvent(new PointerEvent('pointerup', { clientX: 200, clientY: 600, bubbles: true, pointerId: 1 }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })
})
