import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, h } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'

const SimpleToast = defineComponent({
  props: { message: { type: String, default: 'Toast!' } },
  template: '<div class="toast-content" data-test-id="toast-msg">{{ message }}</div>',
})

function createWrapper(
  toastId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)
      return { ...api }
    },
    template: `
      <div>
        <button data-test-id="add-btn" @click="add({ component: $options.SimpleToast })">Add</button>
        <span data-test-id="count">{{ count }}</span>
        <MagicToastProvider id="${toastId}" :options="options" />
      </div>
    `,
    SimpleToast,
    data() {
      return { options }
    },
  })
}

describe('MagicToast - Rendering', () => {
  describe('provider structure', () => {
    it('renders provider wrapper with correct class', async () => {
      render(createWrapper('render-provider'))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider).not.toBeNull()
    })

    it('sets data-id attribute on provider', async () => {
      render(createWrapper('render-data-id'))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-id')).toBe('render-data-id')
    })

    it('sets data-position attribute', async () => {
      render(createWrapper('render-position', { position: 'top-right' }))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-position')).toBe('top-right')
    })

    it('defaults position to bottom', async () => {
      render(createWrapper('render-default-pos'))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-position')).toBe('bottom')
    })

    it('renders list container', async () => {
      render(createWrapper('render-list'))
      await nextTick()

      const list = document.querySelector(
        '.magic-toast-provider__list'
      )
      expect(list).not.toBeNull()
    })

    it('sets data-expanded attribute', async () => {
      render(createWrapper('render-expanded'))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')
    })
  })

  describe('toast view rendering', () => {
    it('renders toast as li element', async () => {
      const screen = render(createWrapper('render-toast-li'))
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view).not.toBeNull()
      expect(view!.tagName.toLowerCase()).toBe('li')
    })

    it('renders toast content via component', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('render-content')
          function addToast() {
            api.add({
              component: SimpleToast,
              props: { message: 'Hello World' },
            })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <MagicToastProvider id="render-content" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('toast-msg'))
        .toHaveTextContent('Hello World')
    })

    it('sets data-id on toast view', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('render-view-id')
          function addToast() {
            api.add({ component: SimpleToast, id: 'my-toast' })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <MagicToastProvider id="render-view-id" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-id')).toBe('my-toast')
    })

    it('renders inner wrapper with drag container', async () => {
      const screen = render(createWrapper('render-inner'))
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      expect(
        document.querySelector('.magic-toast-view__inner')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-toast-view__drag')
      ).not.toBeNull()
    })
  })

  describe('teleport', () => {
    it('teleports to body by default', async () => {
      render(createWrapper('render-teleport'))
      await nextTick()

      const provider = document.body.querySelector(
        ':scope > .magic-toast-provider'
      )
      expect(provider).not.toBeNull()
    })

    it('teleports to custom target', async () => {
      const target = document.createElement('div')
      target.id = 'toast-target'
      document.body.appendChild(target)

      try {
        render(
          createWrapper('render-teleport-custom', {
            teleport: { target: '#toast-target' },
          })
        )
        await nextTick()

        const provider = target.querySelector('.magic-toast-provider')
        expect(provider).not.toBeNull()
      } finally {
        document.body.removeChild(target)
      }
    })

    it('teleport disabled keeps provider in component tree', async () => {
      render(
        createWrapper('render-teleport-disabled', {
          teleport: { disabled: true },
        })
      )
      await nextTick()

      const bodyProvider = document.body.querySelector(
        ':scope > .magic-toast-provider'
      )
      expect(bodyProvider).toBeNull()
      expect(
        document.querySelector('.magic-toast-provider')
      ).not.toBeNull()
    })
  })
})
