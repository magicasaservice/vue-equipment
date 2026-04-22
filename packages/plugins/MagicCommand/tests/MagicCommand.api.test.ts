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
import { CommandId, ViewId, TestId } from './enums'

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

describe('MagicCommand - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicCommand> | undefined
      render(
        defineComponent({
          components: { MagicCommandProvider },
          setup() {
            api = useMagicCommand(CommandId.ApiShape)
            return {}
          },
          template: `<MagicCommandProvider id="${CommandId.ApiShape}"><div /></MagicCommandProvider>`,
        }),
        gc
      )

      expect(typeof api!.open).toBe('function')
      expect(typeof api!.close).toBe('function')
      expect(typeof api!.selectView).toBe('function')
      expect(typeof api!.unselectView).toBe('function')
      expect(typeof api!.selectItem).toBe('function')
      expect(typeof api!.unselectItem).toBe('function')
      expect(api!.isActive.value).toBe(false)
      expect(api!.activeView.value).toBeUndefined()
    })
  })

  describe('open / close', () => {
    it('open sets isActive to true', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.ApiOpen)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ApiOpen}">
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Open).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })

    it('open selects initial view', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.ApiInitial)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.View}">{{ api.activeView.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <MagicCommandProvider id="${CommandId.ApiInitial}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.MainView}" :initial="true">
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
        .element(page.getByTestId(TestId.View))
        .toHaveTextContent(ViewId.MainView)
    })

    it('close deactivates command', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.ApiClose)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button data-test-id="${TestId.Close}" @click="api.close()">Close</button>
            <MagicCommandProvider id="${CommandId.ApiClose}">
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
    })
  })

  describe('selectView / unselectView', () => {
    it('selectView activates a specific view', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper(CommandId.ApiSv)
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="${TestId.View}">{{ api.activeView.value }}</span>
            <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
            <button data-test-id="${TestId.SelectB}" @click="api.unselectView('${ViewId.ViewA}').then(() => api.selectView('${ViewId.ViewB}'))">B</button>
            <MagicCommandProvider id="${CommandId.ApiSv}">
              <MagicCommandRenderer />
              <MagicCommandView id="${ViewId.ViewA}" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
              <MagicCommandView id="${ViewId.ViewB}">
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

      await screen.getByTestId(TestId.SelectB).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.View))
        .toHaveTextContent(ViewId.ViewB)
    })
  })
})
