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

function createMenu(menuId: MenuId, mode: string) {
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
      return { mode }
    },
    template: `
      <MagicMenuProvider id="${menuId}" :options="{ mode: '${mode}' }">
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
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMenu - Options', () => {
  describe('mode: dropdown', () => {
    it('click trigger opens menu', async () => {
      const screen = render(createMenu(MenuId.OptDropdown, 'dropdown'), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('mode: menubar', () => {
    it('click trigger opens menubar', async () => {
      const screen = render(createMenu(MenuId.OptMenubar, 'menubar'), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('mode: context', () => {
    it('right-click trigger opens context menu', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: MenuId.OptContext, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.OptContext}" :options="{ mode: 'context' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger>
                <div data-test-id="${TestId.Area}" style="width: 200px; height: 200px;">Area</div>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Cut</div></MagicMenuItem>
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

  describe('mode: navigation', () => {
    it('mouseenter opens navigation', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: MenuId.OptNav, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.OptNav}" :options="{ mode: 'navigation' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger>
                <div data-test-id="${TestId.Trigger}" style="width: 100px; height: 40px;">Nav</div>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Link 1</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger') as HTMLElement
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('teleport option', () => {
    it('teleport disabled keeps content inline', async () => {
      const screen = render(createMenu(MenuId.OptTeleportDisabled, 'dropdown'), gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('placement', () => {
    it('custom placement accepted on view', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: MenuId.OptPlacement, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.OptPlacement}" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="${ViewId.V0}" placement="top">
              <MagicMenuTrigger>
                <button data-test-id="${TestId.Trigger}">Open</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Item</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-float')).not.toBeNull()
    })
  })
})
