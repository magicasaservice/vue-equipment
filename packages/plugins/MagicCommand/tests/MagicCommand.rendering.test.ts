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

// Helper: open command + emit 'enter' to activate renderer (mimics MagicModal flow)
function useOpenHelper(id: string) {
  const api = useMagicCommand(id)
  const emitter = useMagicEmitter()

  async function openCommand() {
    await api.open()
    emitter.emit('enter', id)
  }

  return { api, openCommand }
}

describe('MagicCommand - Rendering', () => {
  describe('provider', () => {
    it('renders with correct class', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider },
          template: `<MagicCommandProvider id="r-provider"><div>Content</div></MagicCommandProvider>`,
        }),
        gc
      )
      await nextTick()

      const provider = document.querySelector('.magic-command-provider')
      expect(provider).not.toBeNull()
    })

    it('renders with data-id', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider },
          template: `<MagicCommandProvider id="r-data-id"><div>Content</div></MagicCommandProvider>`,
        }),
        gc
      )
      await nextTick()

      const provider = document.querySelector('[data-id="r-data-id"]')
      expect(provider).not.toBeNull()
    })

    it('renders slot content', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider },
          template: `<MagicCommandProvider id="r-slot"><span data-test-id="child">Hello</span></MagicCommandProvider>`,
        }),
        gc
      )
      await nextTick()

      await expect
        .element(page.getByTestId('child'))
        .toHaveTextContent('Hello')
    })
  })

  describe('view', () => {
    it('renders with correct class', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandView },
          template: `
            <MagicCommandProvider id="r-view">
              <MagicCommandView id="v0"><div>View Content</div></MagicCommandView>
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      const view = document.querySelector('.magic-command-view')
      expect(view).not.toBeNull()
    })

    it('renders with data-id', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandView },
          template: `
            <MagicCommandProvider id="r-view-id">
              <MagicCommandView id="my-view"><div>Content</div></MagicCommandView>
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      expect(document.querySelector('[data-id="my-view"]')).not.toBeNull()
    })

    it('exposes view-active slot prop', async () => {
      const wrapper = defineComponent({
        components: { MagicCommandProvider, MagicCommandView },
        setup() {
          useMagicCommand('r-view-slot')
          return {}
        },
        template: `
          <MagicCommandProvider id="r-view-slot">
            <MagicCommandView id="v0" v-slot="{ viewActive }">
              <span data-test-id="active">{{ viewActive }}</span>
            </MagicCommandView>
          </MagicCommandProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('trigger', () => {
    it('renders with correct class', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandView, MagicCommandTrigger },
          setup() {
            useMagicCommand('r-trigger')
            return {}
          },
          template: `
            <MagicCommandProvider id="r-trigger">
              <MagicCommandView id="v0">
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

      expect(document.querySelector('.magic-command-trigger')).not.toBeNull()
    })

    it('has data-active and data-disabled attrs', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandView, MagicCommandTrigger },
          setup() {
            useMagicCommand('r-trigger-attrs')
            return {}
          },
          template: `
            <MagicCommandProvider id="r-trigger-attrs">
              <MagicCommandView id="v0">
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

  describe('renderer', () => {
    it('renders with correct class', async () => {
      render(
        defineComponent({
          components: { MagicCommandProvider, MagicCommandRenderer },
          setup() {
            useMagicCommand('r-renderer')
            return {}
          },
          template: `
            <MagicCommandProvider id="r-renderer">
              <MagicCommandRenderer />
            </MagicCommandProvider>
          `,
        }),
        gc
      )
      await nextTick()

      expect(document.querySelector('.magic-command-renderer')).not.toBeNull()
    })
  })

  describe('item', () => {
    it('renders with correct class and attributes when content is open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('r-item')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="r-item">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="item-1">
                    <div data-test-id="item-content">Item 1</div>
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

      const item = document.querySelector('.magic-command-item')
      expect(item).not.toBeNull()
      expect(item!.getAttribute('data-id')).toBe('item-1')
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
          const { openCommand } = useOpenHelper('r-item-disabled')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="r-item-disabled">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
                <MagicCommandContent>
                  <MagicCommandItem id="d-item" :disabled="true">
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

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[data-id="d-item"]')
      expect(item!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('content', () => {
    it('content not visible when command is closed', async () => {
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
            useMagicCommand('r-content-closed')
            return {}
          },
          template: `
            <MagicCommandProvider id="r-content-closed">
              <MagicCommandRenderer />
              <MagicCommandView id="v0" :initial="true">
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

    it('content visible after open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCommandProvider,
          MagicCommandView,
          MagicCommandContent,
          MagicCommandItem,
          MagicCommandRenderer,
        },
        setup() {
          const { openCommand } = useOpenHelper('r-content-open')
          return { openCommand }
        },
        template: `
          <div>
            <button data-test-id="open" @click="openCommand()">Open</button>
            <MagicCommandProvider id="r-content-open">
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
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-command-content')).not.toBeNull()
    })
  })
})
