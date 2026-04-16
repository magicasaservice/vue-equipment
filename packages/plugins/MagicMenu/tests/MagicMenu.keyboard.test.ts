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

function createDropdown(id: string) {
  return defineComponent({
    components: {
      MagicMenuProvider,
      MagicMenuTrigger,
      MagicMenuView,
      MagicMenuContent,
      MagicMenuItem,
    },
    setup() {
      useMagicMenu({ instanceId: id, viewId: 'v0' })
      return {}
    },
    template: `
      <MagicMenuProvider id="${id}" :options="{ mode: 'dropdown' }">
        <MagicMenuView id="v0">
          <MagicMenuTrigger>
            <button data-test-id="trigger">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem id="kb-item-1">
              <div data-test-id="item-1">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem id="kb-item-2">
              <div data-test-id="item-2">Item 2</div>
            </MagicMenuItem>
            <MagicMenuItem id="kb-item-3">
              <div data-test-id="item-3">Item 3</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

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
      const screen = render(createDropdown('kb-escape'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
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
      const screen = render(createDropdown('kb-escape-attr'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
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
      const screen = render(createDropdown('kb-enter'), gc)
      await nextTick()

      // Focus the trigger element (has tabindex=0 in dropdown mode)
      const trigger = document.querySelector('.magic-menu-trigger') as HTMLElement
      trigger.focus()
      await nextTick()
      await nextTick()

      // onKeyStroke('Enter') on MagicMenuTrigger listens on window
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      )
      // onOpen() is async: wrapperActive → nextTick → innerActive → nextTick
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('tab prevention', () => {
    it('Tab is intercepted when menu is active', async () => {
      const screen = render(createDropdown('kb-tab'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
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

      // Tab event should have been prevented by the menu's key listener
      expect(defaultPrevented).toBe(true)
    })
  })
})
