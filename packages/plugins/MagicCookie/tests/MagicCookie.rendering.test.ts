import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCookieProvider from '../src/components/MagicCookieProvider.vue'
import MagicCookieView from '../src/components/MagicCookieView.vue'
import MagicCookieItem from '../src/components/MagicCookieItem.vue'
import { useMagicCookie } from '../src/composables/useMagicCookie'

/**
 * Stub for Nuxt's <client-only> and @maas/vue-autosize components
 * which aren't fully compatible with test environment.
 */
const ClientOnly = defineComponent({
  name: 'ClientOnly',
  template: '<slot />',
})

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

function createWrapper(
  cookieId: string,
  items: Array<{ id: string; optional?: boolean }> = [
    { id: 'analytics', optional: true },
    { id: 'marketing', optional: true },
  ]
) {
  return defineComponent({
    components: {
      MagicCookieProvider,
      MagicCookieView,
      MagicCookieItem,
      ClientOnly,
    },
    setup() {
      const { showView } = useMagicCookie(cookieId)
      return { showView }
    },
    template: `
      <MagicCookieProvider id="${cookieId}">
        <MagicCookieView>
          <div data-test-id="view-content">
            ${items
              .map(
                (item) => `
              <MagicCookieItem id="${item.id}" :optional="${item.optional !== false}">
                <template #default="{ item }">
                  <div data-test-id="item-${item.id}">{{ item.active }}</div>
                </template>
              </MagicCookieItem>
            `
              )
              .join('')}
          </div>
        </MagicCookieView>
      </MagicCookieProvider>
    `,
  })
}

describe('MagicCookie - Rendering', () => {
  describe('provider structure', () => {
    it('renders the provider wrapper', async () => {
      render(createWrapper('render-provider'), {
        global: { stubs: { ClientOnly } },
      })
      await nextTick()

      const provider = document.querySelector('.magic-cookie-provider')
      expect(provider).not.toBeNull()
    })

    it('renders child content inside provider', async () => {
      render(createWrapper('render-children'), {
        global: { stubs: { ClientOnly } },
      })
      await nextTick()

      const view = document.querySelector('.magic-cookie-view')
      expect(view).not.toBeNull()
    })
  })

  describe('view component', () => {
    it('renders the view wrapper with correct class', async () => {
      render(createWrapper('render-view-class'), {
        global: { stubs: { ClientOnly } },
      })
      await nextTick()

      const view = document.querySelector('.magic-cookie-view')
      expect(view).not.toBeNull()
    })

    it('view inner is hidden when viewActive is false', async () => {
      render(createWrapper('render-view-hidden'), {
        global: { stubs: { ClientOnly } },
      })
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner).not.toBeNull()
      expect(inner.style.display).toBe('none')
    })

    it('view inner is visible when viewActive is true', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const { showView } = useMagicCookie('render-view-visible')
          showView()
          return {}
        },
        template: `
          <MagicCookieProvider id="render-view-visible">
            <MagicCookieView>
              <div data-test-id="content">Visible</div>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner).not.toBeNull()
      expect(inner.style.display).not.toBe('none')
    })

    it('view exposes viewActive via scoped slot', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          ClientOnly,
        },
        setup() {
          const { showView } = useMagicCookie('render-scoped-slot')
          showView()
          return {}
        },
        template: `
          <MagicCookieProvider id="render-scoped-slot">
            <MagicCookieView>
              <template #default="{ viewActive }">
                <span data-test-id="slot-value">{{ viewActive }}</span>
              </template>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('slot-value'))
        .toHaveTextContent('true')
    })

    it('sets animation duration CSS variable', async () => {
      render(createWrapper('render-css-var'), {
        global: { stubs: { ClientOnly } },
      })
      await nextTick()

      const view = document.querySelector(
        '.magic-cookie-view'
      ) as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('300ms')
    })
  })

  describe('item component', () => {
    it('renders item wrapper with correct class', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('render-item-class')
          return {}
        },
        template: `
          <MagicCookieProvider id="render-item-class">
            <MagicCookieItem id="test-cookie">
              <div>Cookie</div>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const item = document.querySelector('.magic-cookie-item')
      expect(item).not.toBeNull()
    })

    it('sets data-id attribute on item', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('render-data-id')
          return {}
        },
        template: `
          <MagicCookieProvider id="render-data-id">
            <MagicCookieItem id="my-cookie">
              <div>Cookie</div>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const item = document.querySelector('.magic-cookie-item')
      expect(item!.getAttribute('data-id')).toBe('my-cookie')
    })

    it('sets data-optional attribute', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('render-optional')
          return {}
        },
        template: `
          <MagicCookieProvider id="render-optional">
            <MagicCookieItem id="opt-cookie" :optional="true">
              <div>Optional</div>
            </MagicCookieItem>
            <MagicCookieItem id="req-cookie" :optional="false">
              <div>Required</div>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const items = document.querySelectorAll('.magic-cookie-item')
      expect(items[0]!.getAttribute('data-optional')).toBe('true')
      expect(items[1]!.getAttribute('data-optional')).toBe('false')
    })

    it('sets data-active attribute', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('render-active')
          return {}
        },
        template: `
          <MagicCookieProvider id="render-active">
            <MagicCookieItem id="active-cookie" :optional="true">
              <div>Cookie</div>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const item = document.querySelector('.magic-cookie-item')
      // Optional cookies default to inactive
      expect(item!.getAttribute('data-active')).toBe('false')
    })

    it('exposes item data via scoped slot', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('render-item-slot')
          return {}
        },
        template: `
          <MagicCookieProvider id="render-item-slot">
            <MagicCookieItem id="slot-cookie" :optional="false">
              <template #default="{ item }">
                <span data-test-id="item-id">{{ item.id }}</span>
                <span data-test-id="item-active">{{ item.active }}</span>
                <span data-test-id="item-optional">{{ item.optional }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId('item-id'))
        .toHaveTextContent('slot-cookie')
      await expect
        .element(page.getByTestId('item-active'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('item-optional'))
        .toHaveTextContent('false')
    })
  })
})
