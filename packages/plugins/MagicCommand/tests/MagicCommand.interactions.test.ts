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
import { useMagicModal } from '../../MagicModal/src/composables/useMagicModal'
import { useMagicDrawer } from '../../MagicDrawer/src/composables/useMagicDrawer'
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
describe('MagicCommand - Interactions', () => {
  describe('trigger click', () => {
    it('trigger click activates command', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandTrigger,
          MagicCommandRenderer,
        },
        setup() {
          const { api } = useOpenHelper(CommandId.Trigger)
          return { api }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <MagicCommandProvider id="${CommandId.Trigger}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}">
                <MagicCommandTrigger>
                  <button data-test-id="${TestId.Trigger}">Open</button>
                </MagicCommandTrigger>
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

      await screen.getByTestId(TestId.Trigger).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('item hover', () => {
    it('mouseenter on item selects it (pointer mode)', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Hover)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Hover}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.Item1}">
                    <div>Item 1</div>
                  </MagicCommandItem>
                  <MagicCommandItem id="${ItemId.Item2}">
                    <div>Item 2</div>
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

      const item = document.querySelector(
        `[data-id="${ItemId.Item1}"]`
      ) as HTMLElement
      expect(item).not.toBeNull()

      item.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await nextTick()
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(item.getAttribute('data-active')).toBe('true')
    })
  })

  describe('item click', () => {
    it('clicking item fires click handler', async () => {
      let clicked = false

      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Click)
          function onItemClick() {
            clicked = true
          }
          return { openCommand, onItemClick }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Click}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.ClickItem}" @click="onItemClick">
                    <div>Click me</div>
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

      const item = document.querySelector(
        `[data-id="${ItemId.ClickItem}"]`
      ) as HTMLElement
      item.click()
      await nextTick()

      expect(clicked).toBe(true)
    })
  })

  describe('initial item selection', () => {
    it('item with :initial="true" is selected on open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Initial)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Initial}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.First}"><div>First</div></MagicCommandItem>
                  <MagicCommandItem id="${ItemId.Second}" :initial="true"><div>Second</div></MagicCommandItem>
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

      expect(
        document
          .querySelector(`[data-id="${ItemId.Second}"]`)!
          .getAttribute('data-active')
      ).toBe('true')
      expect(
        document
          .querySelector(`[data-id="${ItemId.First}"]`)!
          .getAttribute('data-active')
      ).toBe('false')
    })
  })

  describe('close via API', () => {
    it('close() after open deactivates command', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.CloseApi)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button data-test-id="${TestId.Close}" @click="api.close()">Close</button>
            <MagicCommandProvider id="${CommandId.CloseApi}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Close).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('modal open/close sync', () => {
    it('opening the command opens the modal', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ModalSync)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ModalSync}">
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

      expect(document.querySelector('.magic-modal-content')).toBeNull()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-modal-content')).not.toBeNull()
    })

    it('closing the command closes the modal', async () => {
      // modalApi.isActive is exposed in a span — checks that the modal state follows the command state
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.ModalSyncClose)
          const modalApi = useMagicModal(CommandId.ModalSyncClose)
          return { openCommand, modalApi }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ modalApi.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ModalSyncClose}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      // Escape closes the command; MagicCommandModal's watch then calls modalApi.close()
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })

    it('afterLeave event from the modal closes the command', async () => {
      // Simulates the modal closing independently and verifies that afterLeaveCallback
      // in MagicCommandModal calls commandApi.close(). The emit button uses fixed
      // positioning (z-index above backdrop) so Playwright can click it while modal is open.
      // useMagicEmitter() must be captured in setup() to get the app-level singleton.
      const wrapper = defineComponent({
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.ModalAfterLeave)
          const emitter = useMagicEmitter()
          function triggerAfterLeave() {
            emitter.emit('afterLeave', CommandId.ModalAfterLeave as string)
          }
          return { api, openCommand, triggerAfterLeave }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button
              data-test-id="${TestId.Close}"
              @click="triggerAfterLeave()"
              style="position:fixed;z-index:9999;top:10px;right:10px"
            >Emit afterLeave</button>
            <MagicCommandProvider id="${CommandId.ModalAfterLeave}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Close).click()
      await nextTick()
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.Active}"]`)?.textContent
      ).toBe('false')
    })
  })

  describe('drawer open/close sync', () => {
    it('opening the command opens the drawer', async () => {
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.DrawerSync)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.DrawerSync}">
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

      expect(document.querySelector('.magic-drawer-content')).toBeNull()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(document.querySelector('.magic-drawer-content')).not.toBeNull()
    })

    it('closing the command closes the drawer', async () => {
      // drawerApi.isActive is exposed in a span — checks that the drawer state follows the command state
      const wrapper = defineComponent({
        setup() {
          const { openCommand } = useOpenHelper(CommandId.DrawerSyncClose)
          const drawerApi = useMagicDrawer(CommandId.DrawerSyncClose)
          return { openCommand, drawerApi }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ drawerApi.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.DrawerSyncClose}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      // Escape closes the command; MagicCommandDrawer's watch then calls drawerApi.close()
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })

    it('afterLeave event from the drawer closes the command', async () => {
      // Simulates the drawer closing independently and verifies that afterLeaveCallback
      // in MagicCommandDrawer calls commandApi.close(). The emit button uses fixed
      // positioning (z-index above backdrop) so Playwright can click it while drawer is open.
      // useMagicEmitter() must be captured in setup() to get the app-level singleton.
      const wrapper = defineComponent({
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.DrawerAfterLeave)
          const emitter = useMagicEmitter()
          function triggerAfterLeave() {
            emitter.emit('afterLeave', CommandId.DrawerAfterLeave as string)
          }
          return { api, openCommand, triggerAfterLeave }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button
              data-test-id="${TestId.Close}"
              @click="triggerAfterLeave()"
              style="position:fixed;z-index:9999;top:10px;right:10px"
            >Emit afterLeave</button>
            <MagicCommandProvider id="${CommandId.DrawerAfterLeave}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Close).click()
      await nextTick()
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.Active}"]`)?.textContent
      ).toBe('false')
    })
  })
})
