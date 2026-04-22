import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicMenuProvider from '../src/components/MagicMenuProvider.vue'
import MagicMenuTrigger from '../src/components/MagicMenuTrigger.vue'
import MagicMenuView from '../src/components/MagicMenuView.vue'
import MagicMenuContent from '../src/components/MagicMenuContent.vue'
import MagicMenuItem from '../src/components/MagicMenuItem.vue'
import MagicMenuFloat from '../src/components/MagicMenuFloat.vue'
import MagicMenuChannel from '../src/components/MagicMenuChannel.vue'
import MagicMenuRemote from '../src/components/MagicMenuRemote.vue'
import { useMagicMenu } from '../src/composables/useMagicMenu'
import { MenuId, ViewId, ItemId, TestId } from './enums'

// ─── Global config ────────────────────────────────────────────────────────────

const gc = {
  global: {
    components: {
      MagicMenuFloat,
      MagicMenuContent,
      MagicMenuChannel,
      MagicMenuItem,
      MagicMenuProvider,
      MagicMenuRemote,
      MagicMenuTrigger,
      MagicMenuView,
    },
  },
}

// ─── Factory ─────────────────────────────────────────────────────────────────

function createDropdown(menuId: MenuId) {
  return defineComponent({
    components: {
      MagicMenuProvider,
      MagicMenuTrigger,
      MagicMenuView,
      MagicMenuContent,
      MagicMenuItem,
    },
    setup() {
      useMagicMenu({ instanceId: menuId, viewId: ViewId.V0 })
      return {}
    },
    template: `
      <MagicMenuProvider id="${menuId}" :options="{ mode: 'dropdown' }">
        <MagicMenuView id="${ViewId.V0}">
          <MagicMenuTrigger>
            <button data-test-id="${TestId.Trigger}">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem id="${ItemId.KbItem1}">
              <div data-test-id="${TestId.Item1}">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem id="${ItemId.KbItem2}">
              <div data-test-id="${TestId.Item2}">Item 2</div>
            </MagicMenuItem>
            <MagicMenuItem id="${ItemId.KbItem3}">
              <div data-test-id="${TestId.Item3}">Item 3</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMenu - Keyboard Navigation', () => {
  // Suppress MagicError unhandled rejections
  let rejectHandler: (e: PromiseRejectionEvent) => void
  let errorHandler: (e: ErrorEvent) => void

  beforeEach(() => {
    rejectHandler = (e: PromiseRejectionEvent) => {
      if (e.reason?.name === 'MagicError') {
        e.preventDefault()
      }
    }
    errorHandler = (e: ErrorEvent) => {
      if (e.error?.name === 'MagicError') {
        e.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', rejectHandler)
    window.addEventListener('error', errorHandler)
  })
  afterEach(() => {
    window.removeEventListener('unhandledrejection', rejectHandler)
    window.removeEventListener('error', errorHandler)
  })

  describe('escape', () => {
    it('Escape closes open menu', async () => {
      const screen = render(createDropdown(MenuId.KbEscape), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })

    it('Escape resets trigger data-active', async () => {
      const screen = render(createDropdown(MenuId.KbEscapeAttr), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('true')

      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(trigger!.getAttribute('data-active')).toBe('false')
    })
  })

  describe('enter on trigger', () => {
    it('Enter on focused trigger opens menu', async () => {
      render(createDropdown(MenuId.KbEnter), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger') as HTMLElement
      trigger.focus()
      await nextTick()
      await nextTick()

      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      )
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('tab prevention', () => {
    it('Tab is intercepted when menu is active', async () => {
      const screen = render(createDropdown(MenuId.KbTab), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      let defaultPrevented = false
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Tab') defaultPrevented = e.defaultPrevented
      }
      window.addEventListener('keydown', handler)

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      )
      await nextTick()

      window.removeEventListener('keydown', handler)

      expect(defaultPrevented).toBe(true)
    })
  })
})
