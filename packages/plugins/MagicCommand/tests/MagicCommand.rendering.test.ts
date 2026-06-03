import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCommandProvider from '../src/components/MagicCommandProvider.vue'
import MagicCommandModal from '../src/components/MagicCommandModal.vue'
import MagicCommandDrawer from '../src/components/MagicCommandDrawer.vue'
import MagicCommandView from '../src/components/MagicCommandView.vue'
import MagicCommandContent from '../src/components/MagicCommandContent.vue'
import MagicCommandItem from '../src/components/MagicCommandItem.vue'
import MagicCommandTrigger from '../src/components/MagicCommandTrigger.vue'
import MagicCommandRenderer from '../src/components/MagicCommandRenderer.vue'
import MagicModalProvider from '../../MagicModal/src/components/MagicModalProvider.vue'
import MagicModalTeleport from '../../MagicModal/src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../../MagicModal/src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../../MagicModal/src/components/MagicModalContent.vue'
import MagicDrawerProvider from '../../MagicDrawer/src/components/MagicDrawerProvider.vue'
import MagicDrawerTeleport from '../../MagicDrawer/src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../../MagicDrawer/src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../../MagicDrawer/src/components/MagicDrawerContent.vue'
import { useMagicCommand } from '../src/composables/useMagicCommand'
import { useMagicEmitter } from '../../MagicEmitter/src/composables/useMagicEmitter'
import { CommandId, ViewId, ItemId, TestId } from './enums'

// Globals
const gc = {
  global: {
    components: {
      MagicCommandProvider,
      MagicCommandModal,
      MagicCommandDrawer,
      MagicCommandView,
      MagicCommandContent,
      MagicCommandItem,
      MagicCommandTrigger,
      MagicCommandRenderer,
      MagicModalProvider,
      MagicModalTeleport,
      MagicModalBackdrop,
      MagicModalContent,
      MagicDrawerProvider,
      MagicDrawerTeleport,
      MagicDrawerBackdrop,
      MagicDrawerContent,
    },
  },
}

function useOpenHelper(id: string) {
  const api = useMagicCommand(id)
  const emitter = useMagicEmitter()

  async function openCommand() {
    await api.open()
    emitter.emit('enter', id)
  }

  return { api, openCommand }
}

// Tests
describe('MagicCommand - Rendering', () => {
  describe('provider', () => {
    it('renders with data-id attribute', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider },
          template: `<MagicCommandProvider id="${CommandId.DataId}"><div>Content</div></MagicCommandProvider>`,
        }),
        gc
      )
      await nextTick()

      expect(
        document.querySelector(`[data-id="${CommandId.DataId}"]`)
      ).not.toBeNull()
    })

    it('renders slot content', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider },
          template: `<MagicCommandProvider id="${CommandId.RenderSlot}"><span data-test-id="${TestId.Child}">Hello</span></MagicCommandProvider>`,
        }),
        gc
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Child))
        .toHaveTextContent('Hello')
    })
  })

  describe('view', () => {
    it('renders with data-id attribute', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandView },
          template: `
            <MagicCommandProvider id="${CommandId.ViewId}">
              <MagicCommandView id="${ViewId.MyView}"><div>Content</div></MagicCommandView>
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      expect(
        document.querySelector(`[data-id="${ViewId.MyView}"]`)
      ).not.toBeNull()
    })

    it('exposes view-active slot prop defaulting to false', async () => {
      const wrapper = defineComponent({
        components: { MagicCommandProvider, MagicCommandView },
        setup() {
          useMagicCommand(CommandId.ViewSlot)
          return {}
        },
        template: `
          <MagicCommandProvider id="${CommandId.ViewSlot}">
            <MagicCommandView id="${ViewId.V0}" v-slot="{ viewActive }">
              <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
            </MagicCommandView>
          </MagicCommandProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('trigger', () => {
    it('has data-active=false and data-disabled=false by default', async () => {
      render(
        defineComponent({
          components: {
            MagicCommandProvider,
            MagicCommandView,
            MagicCommandTrigger,
          },
          setup() {
            useMagicCommand(CommandId.TriggerAttrs)
            return {}
          },
          template: `
            <MagicCommandProvider id="${CommandId.TriggerAttrs}">
              <MagicCommandView id="${ViewId.V0}">
                <MagicCommandTrigger>
                  <button>Open</button>
                </MagicCommandTrigger>
              </MagicCommandView>
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      const trigger = document.querySelector('.magic-command-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('false')
      expect(trigger!.getAttribute('data-disabled')).toBe('false')
    })
  })

  describe('item', () => {
    it('item has correct data-id and data-disabled=false when content is open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Item)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Item}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.Item1}">
                    <div>Item 1</div>
                  </MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector(`[data-id="${ItemId.Item1}"]`)
      expect(item).not.toBeNull()
      expect(item!.getAttribute('data-disabled')).toBe('false')
    })

    it('disabled item has data-disabled=true', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ItemDisabled)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ItemDisabled}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.DItem}" :disabled="true">
                    <div>Disabled</div>
                  </MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector(`[data-id="${ItemId.DItem}"]`)
      expect(item!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('content', () => {
    it('content not in DOM when command is closed', async () => {
      render(
        defineComponent({
          components: {
            MagicCommandProvider,
            MagicCommandView,
            MagicCommandContent,
            MagicCommandItem,
            MagicCommandRenderer,
          },
          setup() {
            useMagicCommand(CommandId.ContentClosed)
            return {}
          },
          template: `
            <MagicCommandProvider id="${CommandId.ContentClosed}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      expect(document.querySelector('.magic-command-content')).toBeNull()
    })

    it('content in DOM after open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ContentOpen)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ContentOpen}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-command-content')).not.toBeNull()
    })
  })

  describe('modal', () => {
    it('renders backdrop and content when command opens', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ModalDefault)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ModalDefault}">
              <MagicCommandModal :options="{ keyListener: { close: false } }">
                <MagicCommandRenderer />
              </MagicCommandModal>
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-modal-backdrop')).not.toBeNull()
      expect(document.querySelector('.magic-modal-content')).not.toBeNull()
    })

    it('#layout slot replaces default — no backdrop rendered', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ModalLayout)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ModalLayout}">
              <MagicCommandModal :options="{ keyListener: { close: false } }">
                <template #layout>
                  <MagicModalTeleport>
                    <MagicModalContent>
                      <span data-test-id="${TestId.LayoutContent}">Custom</span>
                    </MagicModalContent>
                  </MagicModalTeleport>
                </template>
              </MagicCommandModal>
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-modal-backdrop')).toBeNull()
      expect(document.querySelector('.magic-modal-content')).not.toBeNull()
      expect(
        document.querySelector(`[data-test-id="${TestId.LayoutContent}"]`)
      ).not.toBeNull()
    })
  })

  describe('drawer', () => {
    it('renders backdrop and content when command opens', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.DrawerDefault)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.DrawerDefault}">
              <MagicCommandDrawer :options="{ keyListener: { close: false } }">
                <MagicCommandRenderer />
              </MagicCommandDrawer>
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-drawer-backdrop')).not.toBeNull()
      expect(document.querySelector('.magic-drawer-content')).not.toBeNull()
    })

    it('#layout slot replaces default — no backdrop rendered', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.DrawerLayout)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.DrawerLayout}">
              <MagicCommandDrawer :options="{ keyListener: { close: false } }">
                <template #layout>
                  <MagicDrawerTeleport>
                    <MagicDrawerContent>
                      <span data-test-id="${TestId.LayoutContent}">Custom</span>
                    </MagicDrawerContent>
                  </MagicDrawerTeleport>
                </template>
              </MagicCommandDrawer>
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>Item</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-drawer-backdrop')).toBeNull()
      expect(document.querySelector('.magic-drawer-content')).not.toBeNull()
      expect(
        document.querySelector(`[data-test-id="${TestId.LayoutContent}"]`)
      ).not.toBeNull()
    })
  })
})
