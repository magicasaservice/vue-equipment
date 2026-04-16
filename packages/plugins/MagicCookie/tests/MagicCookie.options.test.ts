import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCookieProvider from '../src/components/MagicCookieProvider.vue'
import MagicCookieView from '../src/components/MagicCookieView.vue'
import MagicCookieItem from '../src/components/MagicCookieItem.vue'
import { useMagicCookie } from '../src/composables/useMagicCookie'

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  template: '<slot />',
})

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

describe('MagicCookie - Options', () => {
  describe('maxAge', () => {
    it('uses default maxAge when not specified', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-max-age-default')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-max-age-default">
            <MagicCookieItem id="age-cookie">
              <template #default="{ item }">
                <span data-test-id="item-data">{{ JSON.stringify(item) }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const data = JSON.parse(
        document.querySelector('[data-test-id="item-data"]')!
          .textContent || '{}'
      )
      // Default maxAge: 24 * 60 * 60 * 60
      expect(data.maxAge).toBe(24 * 60 * 60 * 60)
    })

    it('item-level maxAge overrides provider default', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-max-age-override')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-max-age-override">
            <MagicCookieItem id="custom-age" :max-age="3600">
              <template #default="{ item }">
                <span data-test-id="item-data">{{ JSON.stringify(item) }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const data = JSON.parse(
        document.querySelector('[data-test-id="item-data"]')!
          .textContent || '{}'
      )
      expect(data.maxAge).toBe(3600)
    })
  })

  describe('transition', () => {
    it('uses default transition class name', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          ClientOnly,
        },
        setup() {
          const { showView } = useMagicCookie('opt-transition-default')
          showView()
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-transition-default">
            <MagicCookieView>
              <div>Content</div>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      // View should render and transition name is applied internally
      const view = document.querySelector('.magic-cookie-view')
      expect(view).not.toBeNull()
    })

    it('custom transition option is accepted', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          ClientOnly,
        },
        setup() {
          const { showView } = useMagicCookie('opt-transition-custom')
          showView()
          return {}
        },
        template: `
          <MagicCookieProvider
            id="opt-transition-custom"
            :options="{ transition: 'my-custom-transition' }"
          >
            <MagicCookieView>
              <div data-test-id="custom-content">Content</div>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('custom-content'))
        .toBeVisible()
    })
  })

  describe('animation', () => {
    it('custom animation duration is applied as CSS variable', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-animation-duration')
          return {}
        },
        template: `
          <MagicCookieProvider
            id="opt-animation-duration"
            :options="{ animation: { duration: 500, easing: (t) => t } }"
          >
            <MagicCookieView>
              <div>Content</div>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const view = document.querySelector(
        '.magic-cookie-view'
      ) as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('500ms')
    })

    it('default animation duration is 300ms', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-animation-default')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-animation-default">
            <MagicCookieView>
              <div>Content</div>
            </MagicCookieView>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      const view = document.querySelector(
        '.magic-cookie-view'
      ) as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('300ms')
    })
  })

  describe('optional vs required items', () => {
    it('optional items default to inactive', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-optional-default')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-optional-default">
            <MagicCookieItem id="opt-cookie" :optional="true">
              <template #default="{ item }">
                <span data-test-id="active">{{ item.active }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })

    it('required items default to active', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-required-default')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-required-default">
            <MagicCookieItem id="req-cookie" :optional="false">
              <template #default="{ item }">
                <span data-test-id="active">{{ item.active }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })

    it('omitting optional prop treats item as required (Vue boolean casting)', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('opt-optional-unset')
          return {}
        },
        template: `
          <MagicCookieProvider id="opt-optional-unset">
            <MagicCookieItem id="unset-cookie">
              <template #default="{ item }">
                <span data-test-id="optional">{{ item.optional }}</span>
                <span data-test-id="active">{{ item.active }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly, AutoSize } } })
      await nextTick()

      // Vue boolean casting: unpassed boolean prop defaults to false
      await expect
        .element(page.getByTestId('optional'))
        .toHaveTextContent('false')
      // Required items (optional=false) default to active
      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })
})
