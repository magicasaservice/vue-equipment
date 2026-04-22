import { describe, it, expect } from 'vitest'
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
            <MagicMenuItem id="${ItemId.Item1}">
              <div data-test-id="${TestId.Item1}">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem id="${ItemId.Item2}">
              <div data-test-id="${TestId.Item2}">Item 2</div>
            </MagicMenuItem>
            <MagicMenuItem id="${ItemId.Item3}" :disabled="true">
              <div data-test-id="${TestId.Item3}">Item 3 (disabled)</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMenu - Interactions', () => {
  describe('trigger click', () => {
    it('clicking trigger opens dropdown', async () => {
      const screen = render(createDropdown(MenuId.IntTriggerClick), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })

    it('clicking trigger again closes dropdown', async () => {
      const screen = render(createDropdown(MenuId.IntTriggerToggle), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })

    it('trigger data-active becomes true on open', async () => {
      const screen = render(createDropdown(MenuId.IntTriggerActive), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('false')

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(trigger!.getAttribute('data-active')).toBe('true')
    })
  })

  describe('item hover', () => {
    it('mouseenter on item sets data-active=true', async () => {
      const screen = render(createDropdown(MenuId.IntItemHover), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector(`[data-id="${ItemId.Item1}"]`) as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(item.getAttribute('data-active')).toBe('true')
    })

    it('mouseleave on item resets active', async () => {
      const screen = render(createDropdown(MenuId.IntItemLeave), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector(`[data-id="${ItemId.Item1}"]`) as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(item.getAttribute('data-active')).toBe('false')
    })
  })

  describe('item click', () => {
    it('clicking item closes menu', async () => {
      const screen = render(createDropdown(MenuId.IntItemClick), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector(`[data-id="${ItemId.Item1}"]`) as HTMLElement
      item.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })

  describe('disabled item', () => {
    it('disabled item has data-disabled=true', async () => {
      const screen = render(createDropdown(MenuId.IntItemDisabled), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector(`[data-id="${ItemId.Item3}"]`)
      expect(item!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('context menu', () => {
    it('right-click opens context menu', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: MenuId.IntContext, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.IntContext}" :options="{ mode: 'context' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger>
                <div data-test-id="${TestId.Area}" style="width: 200px; height: 200px;">Right click here</div>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Cut</div></MagicMenuItem>
                <MagicMenuItem><div>Copy</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const area = document.querySelector(`[data-test-id="${TestId.Area}"]`) as HTMLElement
      area.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          button: 2,
          clientX: 100,
          clientY: 100,
        })
      )
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('escape key', () => {
    it('pressing Escape closes menu', async () => {
      const screen = render(createDropdown(MenuId.IntEscape), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })
})
