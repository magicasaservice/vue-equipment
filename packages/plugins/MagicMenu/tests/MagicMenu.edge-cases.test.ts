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

// ─── Tests ────────────────────────────────────────────────────────────────────

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
          useMagicMenu({ instanceId: MenuId.EdgeNested, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.EdgeNested}" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger>
                <button data-test-id="${TestId.Trigger}">Open</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem id="${ItemId.ParentItem}">
                  <div data-test-id="${TestId.Parent}">Parent</div>
                  <MagicMenuView id="${ViewId.V1}">
                    <MagicMenuTrigger>
                      <div data-test-id="${TestId.SubTrigger}">Sub ></div>
                    </MagicMenuTrigger>
                    <MagicMenuContent :teleport="{ disabled: true }">
                      <MagicMenuItem id="${ItemId.SubItem}">
                        <div data-test-id="${TestId.SubItem}">Sub Item</div>
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

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      const nestedView = document.querySelector(`[data-id="${ViewId.V1}"]`)
      expect(nestedView).not.toBeNull()

      const subTrigger = document.querySelector(`[data-id="${ViewId.V1}-trigger"]`)
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
          useMagicMenu({ instanceId: MenuId.EdgeMulti1, viewId: ViewId.V0 })
          useMagicMenu({ instanceId: MenuId.EdgeMulti2, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <div>
            <MagicMenuProvider id="${MenuId.EdgeMulti1}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger>
                  <button data-test-id="${TestId.Trigger1}">Menu 1</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="${TestId.ItemM1}">M1 Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
            <MagicMenuProvider id="${MenuId.EdgeMulti2}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger>
                  <button data-test-id="${TestId.Trigger2}">Menu 2</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem><div data-test-id="${TestId.ItemM2}">M2 Item</div></MagicMenuItem>
                </MagicMenuContent>
              </MagicMenuView>
            </MagicMenuProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger1).click()
      await nextTick()

      expect(document.querySelector(`[data-test-id="${TestId.ItemM1}"]`)).not.toBeNull()
      expect(document.querySelector(`[data-test-id="${TestId.ItemM2}"]`)).toBeNull()
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
          useMagicMenu({ instanceId: MenuId.EdgeUnmount, viewId: ViewId.V0 })
          return { show }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Toggle}" @click="show = !show">Toggle</button>
            <MagicMenuProvider v-if="show" id="${MenuId.EdgeUnmount}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger>
                  <button data-test-id="${TestId.Trigger}">Open</button>
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

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      expect(document.querySelector('.magic-menu-provider')).toBeNull()
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
          useMagicMenu({ instanceId: MenuId.EdgeRapid, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.EdgeRapid}" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="${ViewId.V0}">
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

      for (let i = 0; i < 4; i++) {
        await screen.getByTestId(TestId.Trigger).click()
        await nextTick()
      }

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
          useMagicMenu({ instanceId: MenuId.EdgeSlotProp, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.EdgeSlotProp}" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger v-slot="{ viewActive }">
                <button data-test-id="${TestId.Trigger}">
                  <span data-test-id="${TestId.ActiveState}">{{ viewActive }}</span>
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
        .element(page.getByTestId(TestId.ActiveState))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveState))
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
          useMagicMenu({ instanceId: MenuId.EdgeItemSlot, viewId: ViewId.V0 })
          return {}
        },
        template: `
          <MagicMenuProvider id="${MenuId.EdgeItemSlot}" :options="{ mode: 'dropdown' }">
            <MagicMenuView id="${ViewId.V0}">
              <MagicMenuTrigger>
                <button data-test-id="${TestId.Trigger}">Open</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem id="${ItemId.SlotItem}" v-slot="{ itemActive }">
                  <div data-test-id="${TestId.ItemActive}">{{ itemActive }}</div>
                </MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ItemActive))
        .toHaveTextContent('false')

      const item = document.querySelector(`[data-id="${ItemId.SlotItem}"]`) as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ItemActive))
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
          const api = useMagicMenu({ instanceId: MenuId.EdgeChannel, viewId: ViewId.V0 })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="api.selectView('${ViewId.V0}')">Open</button>
            <MagicMenuProvider id="${MenuId.EdgeChannel}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
                <MagicMenuTrigger>
                  <button>Trigger</button>
                </MagicMenuTrigger>
                <MagicMenuContent :teleport="{ disabled: true }">
                  <MagicMenuItem>
                    <MagicMenuRemote channel-id="ch-1">
                      <div data-test-id="${TestId.Remote1}">Tab 1</div>
                    </MagicMenuRemote>
                  </MagicMenuItem>
                  <MagicMenuChannel id="ch-1">
                    <div data-test-id="${TestId.ChannelContent}">Channel 1 Content</div>
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

      expect(document.querySelector(`[data-test-id="${TestId.ChannelContent}"]`)).toBeNull()

      const remote = document.querySelector('.magic-menu-remote') as HTMLElement
      remote.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.ChannelContent}"]`)
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
          const api = useMagicMenu({ instanceId: MenuId.EdgeRemoteAttr, viewId: ViewId.V0 })
          return { api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="api.selectView('${ViewId.V0}')">Open</button>
            <MagicMenuProvider id="${MenuId.EdgeRemoteAttr}" :options="{ mode: 'dropdown' }">
              <MagicMenuView id="${ViewId.V0}">
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

      await screen.getByTestId(TestId.Open).click()
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
