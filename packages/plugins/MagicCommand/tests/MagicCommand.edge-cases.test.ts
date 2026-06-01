import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCommandProvider from '../src/components/MagicCommandProvider.vue'
import MagicCommandView from '../src/components/MagicCommandView.vue'
import MagicCommandContent from '../src/components/MagicCommandContent.vue'
import MagicCommandItem from '../src/components/MagicCommandItem.vue'
import MagicCommandTrigger from '../src/components/MagicCommandTrigger.vue'
import MagicCommandRenderer from '../src/components/MagicCommandRenderer.vue'
import { useMagicCommand } from '../src/composables/useMagicCommand'
import { useMagicEmitter } from '../../MagicEmitter/src/composables/useMagicEmitter'
import { CommandId, ViewId, ItemId, TestId } from './enums'

// ─── Globals ──────────────────────────────────────────────────────────────────

const gc = {
  global: {
    components: {
      MagicCommandProvider,
      MagicCommandView,
      MagicCommandContent,
      MagicCommandItem,
      MagicCommandTrigger,
      MagicCommandRenderer,
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicCommand - Edge Cases', () => {
  describe('multiple instances', () => {
    it('two command instances have independent state', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const h1 = useOpenHelper(CommandId.Multi1)
          const h2 = useOpenHelper(CommandId.Multi2)
          return {
            api1: h1.api,
            open1: h1.openCommand,
            api2: h2.api,
          }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active1}">{{ api1.isActive.value }}</span>
            <span data-test-id="${TestId.Active2}">{{ api2.isActive.value }}</span>
            <button data-test-id="${TestId.Open1}" @click="open1()">Open 1</button>
            <MagicCommandProvider id="${CommandId.Multi1}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
            <MagicCommandProvider id="${CommandId.Multi2}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>B</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      await screen.getByTestId(TestId.Open1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('false')
    })
  })

  describe('open/close cycle', () => {
    it('repeated open/close keeps state consistent', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.Cycle)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button data-test-id="${TestId.Close}" @click="api.close()">Close</button>
            <MagicCommandProvider id="${CommandId.Cycle}">
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
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Close).click()
      await nextTick()
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('disabled items', () => {
    it('disabled items are not selectable via pointer', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Disabled)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Disabled}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.Enabled}"><div>Enabled</div></MagicCommandItem>
                  <MagicCommandItem id="${ItemId.Disabled}" :disabled="true"><div>Disabled</div></MagicCommandItem>
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

      const disabled = document.querySelector(
        `[data-id="${ItemId.Disabled}"]`
      ) as HTMLElement
      disabled.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await nextTick()
      disabled.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(disabled.getAttribute('data-active')).toBe('false')
    })
  })

  describe('nested views', () => {
    it('nested view and items render inside parent content', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.Nested)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.Nested}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.ParentView}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.ParentItem}">
                    <div>Parent</div>
                    <MagicCommandView id="${ViewId.ChildView}">
                      <MagicCommandContent>
                        <MagicCommandItem id="${ItemId.ChildItem}"><div>Child</div></MagicCommandItem>
                      </MagicCommandContent>
                    </MagicCommandView>
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

      expect(
        document.querySelector(`[data-id="${ItemId.ParentItem}"]`)
      ).not.toBeNull()
      expect(
        document.querySelector(`[data-id="${ViewId.ChildView}"]`)
      ).not.toBeNull()
    })
  })

  describe('slot props', () => {
    it('item slot exposes itemActive=true and itemDisabled=false for initial item', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.EdgeSlot)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.EdgeSlot}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.SItem}" :initial="true" v-slot="{ itemActive, itemDisabled }">
                    <span data-test-id="${TestId.SlotActive}">{{ itemActive }}</span>
                    <span data-test-id="${TestId.SlotDisabled}">{{ itemDisabled }}</span>
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

      await expect
        .element(page.getByTestId(TestId.SlotActive))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.SlotDisabled))
        .toHaveTextContent('false')
    })
  })
})
