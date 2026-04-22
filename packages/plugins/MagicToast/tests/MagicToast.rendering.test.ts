import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'
import { ToastId, TestId } from './enums'

const SimpleToast = defineComponent({
  props: { message: { type: String, default: 'Toast!' } },
  template: `<div class="toast-content" data-test-id="${TestId.ToastMsg}">{{ message }}</div>`,
})

function createWrapper(
  toastId: ToastId,
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
        <button data-test-id="${TestId.AddBtn}" @click="add({ component: $options.SimpleToast })">Add</button>
        <span data-test-id="${TestId.Count}">{{ count }}</span>
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
    it('sets data-id attribute on provider', async () => {
      render(createWrapper(ToastId.RenderDataId))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-id')).toBe(ToastId.RenderDataId)
    })

    it('sets data-position attribute', async () => {
      render(createWrapper(ToastId.RenderPosition, { position: 'top-right' }))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-position')).toBe('top-right')
    })

    it('defaults position to bottom', async () => {
      render(createWrapper(ToastId.RenderDefaultPos))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-position')).toBe('bottom')
    })

    it('sets data-expanded attribute', async () => {
      render(createWrapper(ToastId.RenderExpanded))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')
    })
  })

  describe('toast view rendering', () => {
    it('renders toast as li element', async () => {
      const screen = render(createWrapper(ToastId.RenderToastLi))
      await screen.getByTestId(TestId.AddBtn).click()
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
          const api = useMagicToast(ToastId.RenderContent)
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
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <MagicToastProvider id="${ToastId.RenderContent}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ToastMsg))
        .toHaveTextContent('Hello World')
    })

    it('sets data-id on toast view', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.RenderViewId)
          function addToast() {
            api.add({ component: SimpleToast, id: 'my-toast' })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <MagicToastProvider id="${ToastId.RenderViewId}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-id')).toBe('my-toast')
    })

    it('renders inner wrapper with drag container', async () => {
      const screen = render(createWrapper(ToastId.RenderInner))
      await screen.getByTestId(TestId.AddBtn).click()
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
      render(createWrapper(ToastId.RenderTeleport))
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
          createWrapper(ToastId.RenderTeleportCustom, {
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
        createWrapper(ToastId.RenderTeleportDisabled, {
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
