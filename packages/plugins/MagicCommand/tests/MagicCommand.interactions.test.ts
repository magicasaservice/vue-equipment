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
          const { api } = useOpenHelper('int-trigger')
          return { api }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <MagicCommandProvider id="int-trigger">
              <MagicCommandRenderer />
              <MagicCommandView id="v0">
                <MagicCommandTrigger>
                  <button data-test-id="trigger">Open</button>
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

      await screen.getByTestId('trigger').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
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
          const { openCommand } = useOpenHelper('int-hover')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="int-hover">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="item-1">
                    <div>Item 1</div>
                  </MagicCommandItem>
                  <MagicCommandItem id="item-2">
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

      const item = document.querySelector('[data-id="item-1"]') as HTMLElement
      expect(item).not.toBeNull()

      item.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
      await nextTick()
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(item.getAttribute('data-active')).toBe('true')
    })
  })

  describe('item click', () => {
    it('clicking item emits click event', async () => {
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
          const { openCommand } = useOpenHelper('int-click')
          function onItemClick() { clicked = true }
          return { openCommand, onItemClick }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="int-click">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="click-item" @click="onItemClick">
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

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[data-id="click-item"]') as HTMLElement
      item.click()
      await nextTick()

      expect(clicked).toBe(true)
    })
  })

  describe('initial item selection', () => {
    it('item with initial prop is selected on mount', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('int-initial')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="int-initial">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="first"><div>First</div></MagicCommandItem>
                  <MagicCommandItem id="second" :initial="true"><div>Second</div></MagicCommandItem>
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

      const second = document.querySelector('[data-id="second"]')
      expect(second!.getAttribute('data-active')).toBe('true')

      const first = document.querySelector('[data-id="first"]')
      expect(first!.getAttribute('data-active')).toBe('false')
    })
  })

  describe('close trigger', () => {
    it('close via API after open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { api, openCommand } = useOpenHelper('int-close-api')
          return { api, openCommand }
        },
        template: `
          <div>
            <span data-test-id="active">{{ api.isActive.value }}</span>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <button data-test-id="close" @click="api.close()">Close</button>
            <MagicCommandProvider id="int-close-api">
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
})
