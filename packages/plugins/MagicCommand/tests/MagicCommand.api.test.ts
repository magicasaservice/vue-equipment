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

describe('MagicCommand - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicCommand> | undefined
      render(
        defineComponent({
          components: { MagicCommandProvider },
          setup() {
            api = useMagicCommand('api-shape')
            return {}
          },
          template: `<MagicCommandProvider id="api-shape"><div /></MagicCommandProvider>`,
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
          const { api, openCommand } = useOpenHelper('api-open')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="api-open">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
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
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')

      await screen.getByTestId('open').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
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
          const { api, openCommand } = useOpenHelper('api-initial')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="view">{{ api.activeView.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="api-initial">
              <MagicCommandRenderer />
              <MagicCommandView id="main-view" :initial="true">
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

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('view'))
        .toHaveTextContent('main-view')
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
          const { api, openCommand } = useOpenHelper('api-close')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <button data-test-id="close" @click="api.close()">Close</button>
            <MagicCommandProvider id="api-close">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
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

      await screen.getByTestId('open').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')

      await screen.getByTestId('close').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
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
          const { api, openCommand } = useOpenHelper('api-sv')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="view">{{ api.activeView.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <button data-test-id="select-b" @click="api.unselectView('view-a').then(() => api.selectView('view-b'))">B</button>
            <MagicCommandProvider id="api-sv">
              <MagicCommandRenderer />
              <MagicCommandView id="view-a" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
              <MagicCommandView id="view-b">
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

      await screen.getByTestId('open').click()
      await nextTick()

      await screen.getByTestId('select-b').click()
      await nextTick()

      await expect
        .element(page.getByTestId('view'))
        .toHaveTextContent('view-b')
    })
  })
})
