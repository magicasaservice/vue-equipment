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

describe('MagicMenu - API', () => {
  describe('composable return shape', () => {
    it('returns selectView and unselectView', () => {
      let api: ReturnType<typeof useMagicMenu> | undefined
      render(
        defineComponent({
          components: { MagicMenuProvider },
          setup() {
            api = useMagicMenu({ instanceId: 'api-shape', viewId: 'v0' })
            return {}
          },
          template: `<MagicMenuProvider id="api-shape"><div /></MagicMenuProvider>`,
        }),
        gc
      )

      expect(typeof api!.selectView).toBe('function')
      expect(typeof api!.unselectView).toBe('function')
    })

    it('returns selectChannel and unselectChannel', () => {
      let api: ReturnType<typeof useMagicMenu> | undefined
      render(
        defineComponent({
          components: { MagicMenuProvider },
          setup() {
            api = useMagicMenu({ instanceId: 'api-channel', viewId: 'v0' })
            return {}
          },
          template: `<MagicMenuProvider id="api-channel"><div /></MagicMenuProvider>`,
        }),
        gc
      )

      expect(typeof api!.selectChannel).toBe('function')
      expect(typeof api!.unselectChannel).toBe('function')
    })
  })

  describe('selectView / unselectView', () => {
    it('selectView opens menu content', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuView,
          MagicMenuTrigger,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          const api = useMagicMenu({ instanceId: 'api-select', viewId: 'v0' })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="api.selectView('v0')">Open</button>
            <button data-test-id="close" @click="api.unselectView('v0')">Close</button>
            <MagicMenuProvider id="api-select" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button>Trigger</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="item">Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).toBeNull()

      await screen.getByTestId('open').click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })

    it('unselectView closes menu content', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuView,
          MagicMenuTrigger,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          const api = useMagicMenu({ instanceId: 'api-unselect', viewId: 'v0' })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="api.selectView('v0')">Open</button>
            <button data-test-id="close" @click="api.unselectView('v0')">Close</button>
            <MagicMenuProvider id="api-unselect" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger>
                  <button>Trigger</button>
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

      await screen.getByTestId('open').click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      await screen.getByTestId('close').click()
      await nextTick()
      await nextTick()

      // Content removed after transition
      await new Promise((r) => setTimeout(r, 300))
      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })

  describe('channel selection', () => {
    it('hovering remote activates channel', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuView,
          MagicMenuTrigger,
          MagicMenuContent,
          MagicMenuItem,
          MagicMenuChannel,
          MagicMenuRemote,
        },
        setup() {
          const api = useMagicMenu({ instanceId: 'api-ch-select', viewId: 'v0' })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="api.selectView('v0')">Open</button>
            <MagicMenuProvider id="api-ch-select" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="v0">
                <MagicMenuTrigger><button>Trigger</button></MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem>
                    <MagicMenuRemote channel-id="ch-a">
                      <div data-test-id="remote-a">Remote A</div>
                    </MagicMenuRemote>
                  </MagicMenuItem>
                  <MagicMenuChannel id="ch-a">
                    <div data-test-id="channel-a">Channel A</div>
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
        document.querySelector('[data-test-id="channel-a"]')
      ).toBeNull()

      // Activate channel via remote hover
      const remote = document.querySelector('.magic-menu-remote') as HTMLElement
      remote.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(
        document.querySelector('[data-test-id="channel-a"]')
      ).not.toBeNull()
    })
  })
})
