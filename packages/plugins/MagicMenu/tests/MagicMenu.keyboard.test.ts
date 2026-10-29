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

// Global config
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

// Factory
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

function createNestedDropdown(menuId: MenuId) {
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
            <MagicMenuItem id="${ItemId.KbParentItem}">
              <div>Parent</div>
              <MagicMenuView id="${ViewId.V1}">
                <MagicMenuTrigger>
                  <div>Sub</div>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem id="${ItemId.KbSubItem1}">
                    <div>Sub Item 1</div>
                  </MagicMenuItem>
                  <MagicMenuItem id="${ItemId.KbSubItem2}">
                    <div>Sub Item 2</div>
                  </MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuItem>
            <MagicMenuItem id="${ItemId.KbSiblingItem}">
              <div>Sibling</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

// Tests
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

      const trigger = document.querySelector(
        '.magic-menu-trigger'
      ) as HTMLElement
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
        if (e.key === 'Tab') {
          defaultPrevented = e.defaultPrevented
        }
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

  describe('arrow navigation', () => {
    it('ArrowDown selects the first item', async () => {
      const screen = render(createDropdown(MenuId.KbArrowDown), gc)
      await open(screen)

      press('ArrowDown')
      await nextTick()

      expect(item(ItemId.KbItem1)?.getAttribute('data-active')).toBe('true')
    })

    it('ArrowDown again moves to the next item', async () => {
      const screen = render(createDropdown(MenuId.KbArrowDownTwice), gc)
      await open(screen)

      press('ArrowDown')
      press('ArrowDown')
      await nextTick()

      expect(item(ItemId.KbItem1)?.getAttribute('data-active')).toBe('false')
      expect(item(ItemId.KbItem2)?.getAttribute('data-active')).toBe('true')
    })

    it('ArrowUp moves back to the previous item', async () => {
      const screen = render(createDropdown(MenuId.KbArrowUp), gc)
      await open(screen)

      press('ArrowDown')
      press('ArrowDown')
      press('ArrowUp')
      await nextTick()

      expect(item(ItemId.KbItem1)?.getAttribute('data-active')).toBe('true')
      expect(item(ItemId.KbItem2)?.getAttribute('data-active')).toBe('false')
    })
  })

  describe('pointer during keyboard navigation', () => {
    it('arrow keys disable pointer selection', async () => {
      const screen = render(createDropdown(MenuId.KbPointerDisabled), gc)
      await open(screen)

      press('ArrowDown')
      await nextTick()

      expect(item(ItemId.KbItem1)?.getAttribute('data-pointer-disabled')).toBe(
        'true'
      )
    })

    it('moving the pointer enables pointer selection again', async () => {
      const screen = render(createDropdown(MenuId.KbPointerEnabled), gc)
      await open(screen)

      press('ArrowDown')
      await nextTick()
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
      await nextTick()

      expect(item(ItemId.KbItem1)?.getAttribute('data-pointer-disabled')).toBe(
        'false'
      )
    })
  })
  describe('nested navigation', () => {
    it('ArrowRight on an item with a nested view selects its first item', async () => {
      const screen = render(createNestedDropdown(MenuId.KbNestedRight), gc)
      await open(screen)

      press('ArrowDown')
      press('ArrowRight')
      await frame()

      expect(item(ItemId.KbSubItem1)?.getAttribute('data-active')).toBe('true')
    })

    it('Enter on an item with a nested view selects its first item', async () => {
      const screen = render(createNestedDropdown(MenuId.KbNestedEnter), gc)
      await open(screen)

      press('ArrowDown')
      press('Enter')
      await frame()

      expect(item(ItemId.KbSubItem1)?.getAttribute('data-active')).toBe('true')
    })

    it('ArrowDown inside a nested view moves to its next item', async () => {
      const screen = render(createNestedDropdown(MenuId.KbNestedDown), gc)
      await open(screen)

      press('ArrowDown')
      press('ArrowRight')
      await frame()
      press('ArrowDown')
      await nextTick()

      expect(item(ItemId.KbSubItem1)?.getAttribute('data-active')).toBe('false')
      expect(item(ItemId.KbSubItem2)?.getAttribute('data-active')).toBe('true')
    })

    it('ArrowLeft returns to the parent view', async () => {
      const screen = render(createNestedDropdown(MenuId.KbNestedLeft), gc)
      await open(screen)

      press('ArrowDown')
      press('ArrowRight')
      await frame()
      press('ArrowLeft')
      press('ArrowDown')
      await nextTick()

      expect(item(ItemId.KbSiblingItem)?.getAttribute('data-active')).toBe(
        'true'
      )
      expect(item(ItemId.KbSubItem1)).toBeNull()
    })
  })
})

// Helpers
async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
}

async function frame() {
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await nextTick()
}

function press(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

function item(id: ItemId) {
  return document.querySelector(`.magic-menu-item[data-id="${id}"]`)
}
