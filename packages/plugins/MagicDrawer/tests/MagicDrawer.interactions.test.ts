import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  drawerId: DrawerId = DrawerId.Interact,
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
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-test-id="${TestId.DrawerContent}" style="height: 300px; width: 100%; background: white;">
            Drawer Content
          </div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createDisabledWrapper() {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer(DrawerId.Disabled)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${DrawerId.Disabled}" :options="{ disabled: true }">
          <div data-test-id="${TestId.DrawerContent}">Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

function createCustomKeyWrapper(keys: string[] | false) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer(DrawerId.Key)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${DrawerId.Key}" :options="{ keyListener: { close: keys } }">
          <div>Content</div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { keys }
    },
  })
}

async function openDrawer(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.OpenBtn).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicDrawer - Interactions', () => {
  describe('backdrop click', () => {
    it('clicking backdrop closes the drawer', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      const backdrop = document.querySelector(
        '.magic-drawer__backdrop'
      ) as HTMLElement
      expect(backdrop).not.toBeNull()
      backdrop.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('clicking drawer content does not close the drawer', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      const content = document.querySelector(
        `[data-test-id="${TestId.DrawerContent}"]`
      ) as HTMLElement
      content.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('backdrop has pointer-events none when disabled', async () => {
      const screen = render(createDisabledWrapper())
      await openDrawer(screen)

      const backdrop = document.querySelector(
        '.magic-drawer__backdrop'
      ) as HTMLElement
      expect(backdrop).not.toBeNull()

      const style = window.getComputedStyle(backdrop)
      expect(style.pointerEvents).toBe('none')

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('keyboard interactions', () => {
    it('pressing Escape closes the drawer (default)', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('keyListener.close: false disables keyboard close', async () => {
      const screen = render(createCustomKeyWrapper(false))
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('drag interactions', () => {
    it('pointerdown on drag element sets data-dragging during drag', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement
      expect(drag).not.toBeNull()

      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientX: 200,
          clientY: 300,
          bubbles: true,
          pointerId: 1,
        })
      )

      drag.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 200,
          clientY: 350,
          bubbles: true,
          pointerId: 1,
        })
      )

      await nextTick()

      const drawer = document.querySelector('.magic-drawer')
      expect(drawer!.getAttribute('data-dragging')).toBe('true')

      drag.dispatchEvent(
        new PointerEvent('pointerup', {
          clientX: 200,
          clientY: 350,
          bubbles: true,
          pointerId: 1,
        })
      )
      await nextTick()
    })

    it('data-dragged reflects whether drag has occurred', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      const drawer = document.querySelector('.magic-drawer')
      expect(drawer!.getAttribute('data-dragged')).toBe('false')

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement

      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientX: 200,
          clientY: 300,
          screenX: 200,
          screenY: 300,
          bubbles: true,
          pointerId: 1,
          isPrimary: true,
        })
      )

      await new Promise((r) => setTimeout(r, 10))

      document.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 200,
          clientY: 400,
          screenX: 200,
          screenY: 400,
          bubbles: true,
          pointerId: 1,
          isPrimary: true,
        })
      )

      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(drawer!.getAttribute('data-dragged')).toBe('true')

      document.dispatchEvent(
        new PointerEvent('pointerup', {
          clientX: 200,
          clientY: 400,
          screenX: 200,
          screenY: 400,
          bubbles: true,
          pointerId: 1,
          isPrimary: true,
        })
      )
    })

    it('disabled drawer does not respond to pointer events', async () => {
      const screen = render(createDisabledWrapper())
      await openDrawer(screen)

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement

      if (drag) {
        drag.dispatchEvent(
          new PointerEvent('pointerdown', {
            clientX: 200,
            clientY: 300,
            bubbles: true,
            pointerId: 1,
          })
        )

        drag.dispatchEvent(
          new PointerEvent('pointermove', {
            clientX: 200,
            clientY: 500,
            bubbles: true,
            pointerId: 1,
          })
        )

        await nextTick()

        const drawer = document.querySelector('.magic-drawer')
        expect(drawer!.getAttribute('data-dragging')).toBe('false')
      }
    })
  })

  describe('preventDragClose', () => {
    it('preventDragClose prevents swipe-to-dismiss', async () => {
      const screen = render(
        createWrapper(DrawerId.Interact, { preventDragClose: true })
      )
      await openDrawer(screen)

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement

      drag.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientX: 200,
          clientY: 200,
          bubbles: true,
          pointerId: 1,
        })
      )

      for (let y = 200; y <= 600; y += 50) {
        drag.dispatchEvent(
          new PointerEvent('pointermove', {
            clientX: 200,
            clientY: y,
            bubbles: true,
            pointerId: 1,
          })
        )
      }

      drag.dispatchEvent(
        new PointerEvent('pointerup', {
          clientX: 200,
          clientY: 600,
          bubbles: true,
          pointerId: 1,
        })
      )

      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })
})
