import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

function createWrapper(options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer('interact-drawer')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicDrawer id="interact-drawer" :options="options">
          <div data-test-id="drawer-content" style="height: 300px; width: 100%; background: white;">
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
      const { open, close, isActive } = useMagicDrawer('disabled-drawer')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicDrawer id="disabled-drawer" :options="{ disabled: true }">
          <div data-test-id="drawer-content">Content</div>
        </MagicDrawer>
      </div>
    `,
  })
}

function createCustomKeyWrapper(keys: string[] | false) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer('key-drawer')
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicDrawer id="key-drawer" :options="{ keyListener: { close: keys } }">
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
  await screen.getByTestId('open-btn').click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

describe('MagicDrawer - Interactions', () => {
  describe('backdrop click', () => {
    it('clicking backdrop closes the drawer', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      const backdrop = document.querySelector(
        '.magic-drawer__backdrop'
      ) as HTMLElement
      expect(backdrop).not.toBeNull()
      // Use DOM click since backdrop is a real interactive element
      backdrop.click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('clicking drawer content does not close the drawer', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      const content = document.querySelector(
        '[data-test-id="drawer-content"]'
      ) as HTMLElement
      content.click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
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
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('keyboard interactions', () => {
    it('pressing Escape closes the drawer (default)', async () => {
      const screen = render(createWrapper())
      await openDrawer(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('keyListener.close: false disables keyboard close', async () => {
      const screen = render(createCustomKeyWrapper(false))
      await openDrawer(screen)

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      await expect
        .element(page.getByTestId('is-active'))
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

      // Simulate pointer down + move
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

      // Release
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
      // Before any drag, data-dragged should be false
      expect(drawer!.getAttribute('data-dragged')).toBe('false')

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement

      // Simulate pointerdown — sets dragging state and registers pointermove listener
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

      // Small delay to ensure pointermove listener is registered on document
      await new Promise((r) => setTimeout(r, 10))

      // Dispatch pointermove on document (where the listener is registered)
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

      // After drag, data-dragged should be true
      expect(drawer!.getAttribute('data-dragged')).toBe('true')

      // Cleanup
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
      const screen = render(createWrapper({ preventDragClose: true }))
      await openDrawer(screen)

      const drag = document.querySelector(
        '.magic-drawer__drag'
      ) as HTMLElement

      // Simulate a large downward drag (for bottom drawer, this would close)
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
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })
})
