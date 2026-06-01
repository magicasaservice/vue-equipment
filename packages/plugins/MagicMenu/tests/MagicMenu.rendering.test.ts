import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicMenuProvider from '../src/components/MagicMenuProvider.vue'
import MagicMenuTrigger from '../src/components/MagicMenuTrigger.vue'
import MagicMenuView from '../src/components/MagicMenuView.vue'
import MagicMenuContent from '../src/components/MagicMenuContent.vue'
import MagicMenuItem from '../src/components/MagicMenuItem.vue'
import MagicMenuChannel from '../src/components/MagicMenuChannel.vue'
import MagicMenuRemote from '../src/components/MagicMenuRemote.vue'
import MagicMenuFloat from '../src/components/MagicMenuFloat.vue'
import { useMagicMenu } from '../src/composables/useMagicMenu'
import { MenuId, ViewId, TestId } from './enums'

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
        <MagicMenuView>
          <MagicMenuTrigger>
            <button data-test-id="${TestId.Trigger}">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem>
              <div data-test-id="${TestId.Item1}">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem>
              <div data-test-id="${TestId.Item2}">Item 2</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMenu - Rendering', () => {
  describe('provider', () => {
    it('sets data-id', async () => {
      render(createDropdown(MenuId.RenderDataId), gc)
      await nextTick()

      const el = document.querySelector('.magic-menu-provider')
      expect(el!.getAttribute('data-id')).toBe(MenuId.RenderDataId)
    })
  })

  describe('trigger', () => {
    it('has data-active=false by default', async () => {
      render(createDropdown(MenuId.RenderTriggerActive), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('false')
    })

    it('has data-disabled=false by default', async () => {
      render(createDropdown(MenuId.RenderTriggerDisabled), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('false')
    })

    it('first trigger has tabindex=0', async () => {
      render(createDropdown(MenuId.RenderTriggerTab), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('tabindex')).toBe('0')
    })

    it('renders slot content', async () => {
      render(createDropdown(MenuId.RenderTriggerSlot), gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Trigger))
        .toHaveTextContent('Open')
    })
  })

  describe('view', () => {
    it('has data-id attribute', async () => {
      render(createDropdown(MenuId.RenderViewId), gc)
      await nextTick()

      const view = document.querySelector('.magic-menu-view')
      expect(view!.hasAttribute('data-id')).toBe(true)
    })
  })

  describe('content (closed)', () => {
    it('content not rendered when menu closed', async () => {
      render(createDropdown(MenuId.RenderContentClosed), gc)
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })

  describe('content (open)', () => {
    it('content renders when trigger clicked', async () => {
      const screen = render(createDropdown(MenuId.RenderContentOpen), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })

    it('content has data-id attribute', async () => {
      const screen = render(createDropdown(MenuId.RenderContentId), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const content = document.querySelector('.magic-menu-content')
      expect(content!.hasAttribute('data-id')).toBe(true)
    })

    it('content inner has pointer-disabled attr', async () => {
      const screen = render(createDropdown(MenuId.RenderContentInner), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const inner = document.querySelector('.magic-menu-content__inner')
      expect(inner).not.toBeNull()
      expect(inner!.hasAttribute('data-pointer-disabled')).toBe(true)
    })
  })

  describe('item', () => {
    it('item renders when menu open', async () => {
      const screen = render(createDropdown(MenuId.RenderItem), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const items = document.querySelectorAll('.magic-menu-item')
      expect(items.length).toBe(2)
    })

    it('item has data-active=false by default', async () => {
      const screen = render(createDropdown(MenuId.RenderItemActive), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector('.magic-menu-item')
      expect(item!.getAttribute('data-active')).toBe('false')
    })

    it('item has data-disabled=false by default', async () => {
      const screen = render(createDropdown(MenuId.RenderItemDisabled), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      const item = document.querySelector('.magic-menu-item')
      expect(item!.getAttribute('data-disabled')).toBe('false')
    })

    it('item renders slot content', async () => {
      const screen = render(createDropdown(MenuId.RenderItemSlot), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Item1))
        .toHaveTextContent('Item 1')
    })
  })

  describe('float', () => {
    it('float renders inside content', async () => {
      const screen = render(createDropdown(MenuId.RenderFloat), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-float')).not.toBeNull()
    })
  })

  describe('disabled trigger', () => {
    it('renders with data-disabled=true', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: MenuId.RenderDisabledTrigger, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.RenderDisabledTrigger}" :options="{ mode: 'dropdown' }">
            <MagicMenuView>
              <MagicMenuTrigger :disabled="true">
                <button data-test-id="${TestId.Trigger}">Disabled</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Item</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('true')
    })
  })
})
