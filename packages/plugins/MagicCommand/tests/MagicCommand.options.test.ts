import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCommandProvider from '../src/components/MagicCommandProvider.vue'
import MagicCommandView from '../src/components/MagicCommandView.vue'
import MagicCommandContent from '../src/components/MagicCommandContent.vue'
import MagicCommandItem from '../src/components/MagicCommandItem.vue'
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

describe('MagicCommand - Options', () => {
  describe('keyListener', () => {
    it('keyListener.open=false prevents keyboard shortcut from opening', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const api = useMagicCommand(CommandId.NoKey)
          return { api }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <MagicCommandProvider id="${CommandId.NoKey}" :options="{ keyListener: { open: false } }">
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

      render(wrapper, gc)
      await nextTick()

      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('initial view', () => {
    it('view with :initial="true" is selected on open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.InitialView)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.View}">{{ api.activeView.value ?? 'none' }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.InitialView}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.NonInitial}">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
              <MagicCommandView id="${ViewId.TheInitial}" :initial="true">
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

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.View))
        .toHaveTextContent(ViewId.TheInitial)
    })
  })

  describe('loop option', () => {
    it('initial item is active with loop=false', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper(CommandId.NoLoop)
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.NoLoop}" :options="{ loop: false }">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.V0}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="${ItemId.LItem1}" :initial="true">
                    <div>Item 1</div>
                  </MagicCommandItem>
                  <MagicCommandItem id="${ItemId.LItem2}">
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

      expect(
        document
          .querySelector(`[data-id="${ItemId.LItem1}"]`)!
          .getAttribute('data-active')
      ).toBe('true')
    })
  })
})
