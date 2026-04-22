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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMenu - API', () => {
  describe('composable return shape', () => {
    it('returns selectView and unselectView', () => {
      let api: ReturnType<typeof useMagicMenu> | undefined
      render(
        defineComponent({
          components: { MagicMenuProvider },
          setup() {
            api = useMagicMenu({ instanceId: MenuId.ApiShape, viewId: ViewId.V0 })
            return {}
          },
          template: `<MagicMenuProvider id="${MenuId.ApiShape}"><div /></MagicMenuProvider>`,
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
            api = useMagicMenu({ instanceId: MenuId.ApiChannel, viewId: ViewId.V0 })
            return {}
          },
          template: `<MagicMenuProvider id="${MenuId.ApiChannel}"><div /></MagicMenuProvider>`,
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
          const api = useMagicMenu({ instanceId: MenuId.ApiSelect, viewId: ViewId.V0 })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="api.selectView('${ViewId.V0}')">Open</button>
            <button data-test-id="${TestId.Close}" @click="api.unselectView('${ViewId.V0}')">Close</button>
            <MagicMenuProvider id="${MenuId.ApiSelect}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger>
                  <button>Trigger</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="${TestId.Item}">Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).toBeNull()

      await screen.getByTestId(TestId.Open).click()
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
          const api = useMagicMenu({ instanceId: MenuId.ApiUnselect, viewId: ViewId.V0 })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="api.selectView('${ViewId.V0}')">Open</button>
            <button data-test-id="${TestId.Close}" @click="api.unselectView('${ViewId.V0}')">Close</button>
            <MagicMenuProvider id="${MenuId.ApiUnselect}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
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

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      await screen.getByTestId(TestId.Close).click()
      await nextTick()
      await nextTick()
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
          const api = useMagicMenu({ instanceId: MenuId.ApiChSelect, viewId: ViewId.V0 })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="api.selectView('${ViewId.V0}')">Open</button>
            <MagicMenuProvider id="${MenuId.ApiChSelect}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger><button>Trigger</button></MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem>
                    <MagicMenuRemote channel-id="ch-a">
                      <div data-test-id="${TestId.RemoteA}">Remote A</div>
                    </MagicMenuRemote>
                  </MagicMenuItem>
                  <MagicMenuChannel id="ch-a">
                    <div data-test-id="${TestId.ChannelA}">Channel A</div>
                  </MagicMenuChannel>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()

      expect(document.querySelector(`[data-test-id="${TestId.ChannelA}"]`)).toBeNull()

      const remote = document.querySelector('.magic-menu-remote') as HTMLElement
      remote.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.ChannelA}"]`)
      ).not.toBeNull()
    })
  })
})
