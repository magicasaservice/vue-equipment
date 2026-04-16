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

describe('MagicCommand - Options', () => {
  describe('keyListener', () => {
    it('disabled open key does not open command', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const api = useMagicCommand('opt-no-key')
          return { api }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <MagicCommandProvider id="opt-no-key" :options="{ keyListener: { open: false } }">
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

      render(wrapper, gc)
      await nextTick()

      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('initial view', () => {
    it('view with initial=true opens by default', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper('opt-initial-view')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="view">{{ api.activeView.value ?? 'none' }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="opt-initial-view">
              <MagicCommandRenderer />
              <MagicCommandView id="non-initial">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
              <MagicCommandView id="the-initial" :initial="true">
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
      await nextTick()

      await expect
        .element(page.getByTestId('view'))
        .toHaveTextContent('the-initial')
    })
  })

  describe('loop option', () => {
    it('initial item is selected with loop false', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('opt-no-loop')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="opt-no-loop" :options="{ loop: false }">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="l-item-1" :initial="true">
                    <div>Item 1</div>
                  </MagicCommandItem>
                  <MagicCommandItem id="l-item-2">
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

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const item1 = document.querySelector('[data-id="l-item-1"]')
      expect(item1!.getAttribute('data-active')).toBe('true')
    })
  })
})
