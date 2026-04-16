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
          const h1 = useOpenHelper('edge-multi-1')
          const h2 = useOpenHelper('edge-multi-2')
          return {
            api1: h1.api,
            open1: h1.openCommand,
            api2: h2.api,
          }
        },
        template: `
          <div>
            <span data-test-id="active-1">{{ api1.isActive.value }}</span>
            <span data-test-id="active-2">{{ api2.isActive.value }}</span>
            <button data-test-id="open-1" @click="open1()">Open 1</button>
            <MagicCommandProvider id="edge-multi-1">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem><div>A</div></MagicCommandItem>
                </MagicCommandContent>
              </MagicCommandView>
            </MagicCommandProvider>
            <MagicCommandProvider id="edge-multi-2">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
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

      await screen.getByTestId('open-1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
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
          const { api, openCommand } = useOpenHelper('edge-cycle')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <button data-test-id="close" @click="api.close()">Close</button>
            <MagicCommandProvider id="edge-cycle">
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

      await screen.getByTestId('open').click()
      await nextTick()
      await expect
        .element(page.getByTestId('active'))
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
          const { openCommand } = useOpenHelper('edge-disabled')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="edge-disabled">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="enabled"><div>Enabled</div></MagicCommandItem>
                  <MagicCommandItem id="disabled" :disabled="true"><div>Disabled</div></MagicCommandItem>
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

      const disabled = document.querySelector('[data-id="disabled"]') as HTMLElement
      disabled.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await nextTick()
      disabled.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(disabled.getAttribute('data-active')).toBe('false')
    })
  })

  describe('nested views', () => {
    it('nested view renders inside parent content', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('edge-nested')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="edge-nested">
              <MagicCommandRenderer />
              <MagicCommandView id="parent-view" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="parent-item">
                    <div>Parent</div>
                    <MagicCommandView id="child-view">
                      <MagicCommandContent>
                        <MagicCommandItem id="child-item"><div>Child</div></MagicCommandItem>
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

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('[data-id="parent-item"]')).not.toBeNull()
      expect(document.querySelector('[data-id="child-view"]')).not.toBeNull()
    })
  })

  describe('slot props', () => {
    it('item slot exposes active and disabled props', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('edge-slot')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="edge-slot">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="s-item" :initial="true" v-slot="{ itemActive, itemDisabled }">
                    <span data-test-id="slot-active">{{ itemActive }}</span>
                    <span data-test-id="slot-disabled">{{ itemDisabled }}</span>
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

      await expect
        .element(page.getByTestId('slot-active'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('slot-disabled'))
        .toHaveTextContent('false')
    })
  })
})
