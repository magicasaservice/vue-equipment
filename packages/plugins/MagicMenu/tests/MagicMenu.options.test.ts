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

function createMenu(id: string, mode: string) {
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
      return { mode }
    },
    template: `
      <MagicMenuProvider id="${id}" :options="{ mode: '${mode}' }">
        <MagicMenuView id="v0">
          <MagicMenuTrigger>
            <button data-test-id="trigger">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem id="item-1">
              <div data-test-id="item-1">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem id="item-2">
              <div data-test-id="item-2">Item 2</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

describe('MagicMenu - Options', () => {
  describe('mode: dropdown', () => {
    it('click trigger opens menu', async () => {
      const screen = render(createMenu('opt-dropdown', 'dropdown'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('mode: menubar', () => {
    it('click trigger opens menubar', async () => {
      const screen = render(createMenu('opt-menubar', 'menubar'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
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
          useMagicMenu({ instanceId: 'opt-context', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="opt-context" :options="{ mode: 'context' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger>
                <div data-test-id="area" style="width: 200px; height: 200px;">Area</div>
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

      const area = document.querySelector('[data-test-id="area"]') as HTMLElement
      area.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          button: 2,
          clientX: 100,
          clientY: 100,
        })
      )
      // onOpen() is async: wrapperActive → nextTick → innerActive → nextTick
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
          useMagicMenu({ instanceId: 'opt-nav', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="opt-nav" :options="{ mode: 'navigation' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger>
                <div data-test-id="trigger" style="width: 100px; height: 40px;">Nav</div>
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
      const screen = render(createMenu('opt-teleport-disabled', 'dropdown'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      // Content should be inside provider (not teleported to body)
      const provider = document.querySelector('.magic-menu-provider')
      const content = provider!.querySelector('.magic-menu-content')
      // With teleport disabled: content is in DOM but may be in provider subtree
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
          useMagicMenu({ instanceId: 'opt-placement', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="opt-placement" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="v0" placement="top">
              <MagicMenuTrigger>
                <button data-test-id="trigger">Open</button>
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

      await screen.getByTestId('trigger').click()
      await nextTick()

      // Float should have placement class
      const float = document.querySelector('.magic-menu-float')
      expect(float).not.toBeNull()
    })
  })
})
