import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
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

describe('MagicMenu - Edge Cases', () => {
  describe('nested menus', () => {
    it('nested view and trigger render inside parent content', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'edge-nested', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="edge-nested" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger>
                <button data-test-id="trigger">Open</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem id="parent-item">
                  <div data-test-id="parent">Parent</div>
                  <MagicMenuView id="v1">
                    <MagicMenuTrigger>
                      <div data-test-id="sub-trigger">Sub ></div>
                    </MagicMenuTrigger>
                    <MagicMenuContent :teleport="{ disabled: true }">
                      <MagicMenuItem id="sub-item">
                        <div data-test-id="sub-item">Sub Item</div>
                      </MagicMenuItem>
                    </MagicMenuContent>
                  </MagicMenuView>
                </MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      // Open main menu
      await screen.getByTestId('trigger').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      // Main content renders
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      // Nested view and trigger are rendered inside parent content
      const nestedView = document.querySelector('[data-id="v1"]')
      expect(nestedView).not.toBeNull()

      const subTrigger = document.querySelector('[data-id="v1-trigger"]')
      expect(subTrigger).not.toBeNull()
      expect(subTrigger!.classList.contains('magic-menu-trigger')).toBe(true)
    })
  })

  describe('multiple instances', () => {
    it('two menus do not interfere', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'edge-multi-1', viewId: 'v0' })
          useMagicMenu({ instanceId: 'edge-multi-2', viewId: 'v0' })
          return {}
        },
        template: `
          <div>
            <MagicMenuProvider id="edge-multi-1" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button data-test-id="trigger-1">Menu 1</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="item-m1">M1 Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
            <MagicMenuProvider id="edge-multi-2" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button data-test-id="trigger-2">Menu 2</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="item-m2">M2 Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      // Open menu 1
      await screen.getByTestId('trigger-1').click()
      await nextTick()

      expect(
        document.querySelector('[data-test-id="item-m1"]')
      ).not.toBeNull()
      expect(
        document.querySelector('[data-test-id="item-m2"]')
      ).toBeNull()
    })
  })

  describe('unmount cleanup', () => {
    it('removing menu cleans up DOM', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          const show = ref(true)
          useMagicMenu({ instanceId: 'edge-unmount', viewId: 'v0' })
          return { show }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="show = !show">Toggle</button>
            <MagicMenuProvider v-if="show" id="edge-unmount" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button data-test-id="trigger">Open</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div>Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      expect(
        document.querySelector('.magic-menu-provider')
      ).not.toBeNull()

      await screen.getByTestId('toggle').click()
      await nextTick()

      expect(
        document.querySelector('.magic-menu-provider')
      ).toBeNull()
    })
  })

  describe('rapid toggle', () => {
    it('rapid open/close settles correctly', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'edge-rapid', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="edge-rapid" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="v0">
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

      for (let i = 0; i < 4; i++) {
        await screen.getByTestId('trigger').click()
        await nextTick()
      }

      // After even number of clicks → closed
      await new Promise((r) => setTimeout(r, 300))
      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })

  describe('slot props', () => {
    it('trigger exposes view-active slot prop', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'edge-slot-prop', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="edge-slot-prop" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger v-slot="{ viewActive }">
                <button data-test-id="trigger">
                  <span data-test-id="active-state">{{ viewActive }}</span>
                </button>
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

      await expect
        .element(page.getByTestId('active-state'))
        .toHaveTextContent('false')

      await screen.getByTestId('trigger').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-state'))
        .toHaveTextContent('true')
    })

    it('item exposes item-active slot prop', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'edge-item-slot', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="edge-item-slot" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger>
                <button data-test-id="trigger">Open</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem id="slot-item" v-slot="{ itemActive }">
                  <div data-test-id="item-active">{{ itemActive }}</div>
                </MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      await expect
        .element(page.getByTestId('item-active'))
        .toHaveTextContent('false')

      // Hover item
      const item = document.querySelector('[data-id="slot-item"]') as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId('item-active'))
        .toHaveTextContent('true')
    })
  })

  describe('channels', () => {
    it('channel renders when active', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
          MagicMenuChannel,
          MagicMenuRemote,
        },
        setup() {
          const api = useMagicMenu({ instanceId: 'edge-channel', viewId: 'v0' })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="api.selectView('v0')">Open</button>
            <MagicMenuProvider id="edge-channel" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button>Trigger</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem>
                    <MagicMenuRemote channel-id="ch-1">
                      <div data-test-id="remote-1">Tab 1</div>
                    </MagicMenuRemote>
                  </MagicMenuItem>
                  <MagicMenuChannel id="ch-1">
                    <div data-test-id="channel-content">Channel 1 Content</div>
                  </MagicMenuChannel>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()

      // Channel not active yet
      expect(
        document.querySelector('[data-test-id="channel-content"]')
      ).toBeNull()

      // Activate channel via remote hover
      const remote = document.querySelector('.magic-menu-remote') as HTMLElement
      remote.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(
        document.querySelector('[data-test-id="channel-content"]')
      ).not.toBeNull()
    })

    it('remote has data-active attribute', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
          MagicMenuChannel,
          MagicMenuRemote,
        },
        setup() {
          const api = useMagicMenu({ instanceId: 'edge-remote-attr', viewId: 'v0' })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="api.selectView('v0')">Open</button>
            <MagicMenuProvider id="edge-remote-attr" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger><button>Trigger</button></MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem>
                    <MagicMenuRemote channel-id="ch-r">
                      <div>Remote</div>
                    </MagicMenuRemote>
                  </MagicMenuItem>
                  <MagicMenuChannel id="ch-r">
                    <div>Content</div>
                  </MagicMenuChannel>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()

      const remote = document.querySelector('.magic-menu-remote')
      expect(remote!.getAttribute('data-active')).toBe('false')

      ;(remote as HTMLElement).dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true })
      )
      await nextTick()

      expect(remote!.getAttribute('data-active')).toBe('true')
    })
  })
})
