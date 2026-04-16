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

function createWrapper(
  cookieId: string,
  items: Array<{ id: string; optional?: boolean }> = [
    { id: 'analytics', optional: true },
    { id: 'necessary', optional: false },
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
      const api = useMagicCookie(cookieId)
      return { ...api }
    },
    template: `
      <div>
        <button data-test-id="show-view" @click="showView">Show</button>
        <button data-test-id="hide-view" @click="hideView">Hide</button>
        <button data-test-id="toggle-view" @click="toggleView">Toggle</button>
        <button data-test-id="accept-all" @click="acceptAll">Accept All</button>
        <button data-test-id="reject-all" @click="rejectAll">Reject All</button>
        <button data-test-id="accept-selected" @click="acceptSelected">Accept Selected</button>
        <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
        <span data-test-id="cookies-set">{{ cookiesSet }}</span>
        <MagicCookieProvider id="${cookieId}">
          <MagicCookieView>
            <div data-test-id="view-content">Cookie Banner</div>
          </MagicCookieView>
          ${items
            .map(
              (item) => `
            <MagicCookieItem id="${item.id}" :optional="${item.optional !== false}">
              <template #default="{ item }">
                <span data-test-id="item-${item.id}">{{ item.active }}</span>
              </template>
            </MagicCookieItem>
          `
            )
            .join('')}
        </MagicCookieProvider>
      </div>
    `,
  })
}

describe('MagicCookie - API', () => {
  describe('view management', () => {
    it('showView() makes the view visible', async () => {
      const screen = render(createWrapper('api-show'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      await screen.getByTestId('show-view').click()
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner.style.display).not.toBe('none')
    })

    it('hideView() hides the view', async () => {
      const screen = render(createWrapper('api-hide'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      await screen.getByTestId('show-view').click()
      await nextTick()

      await screen.getByTestId('hide-view').click()
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner.style.display).toBe('none')
    })

    it('toggleView() toggles visibility', async () => {
      const screen = render(createWrapper('api-toggle'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      const inner = () =>
        document.querySelector(
          '.magic-cookie-view__inner'
        ) as HTMLElement

      // Initially hidden
      expect(inner().style.display).toBe('none')

      // Toggle on
      await screen.getByTestId('toggle-view').click()
      await nextTick()
      expect(inner().style.display).not.toBe('none')

      // Toggle off
      await screen.getByTestId('toggle-view').click()
      await nextTick()
      expect(inner().style.display).toBe('none')
    })
  })

  describe('item selection', () => {
    it('selectItem() activates a cookie', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('api-select')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="select" @click="selectItem('my-cookie')">Select</button>
            <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="api-select">
              <MagicCookieItem id="my-cookie" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          </div>
        `,
      })

      const screen = render(wrapper, {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      // Initially inactive (optional defaults to false)
      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')

      await screen.getByTestId('select').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })

    it('unselectItem() deactivates a cookie', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('api-unselect')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="select" @click="selectItem('uns-cookie')">Select</button>
            <button data-test-id="unselect" @click="unselectItem('uns-cookie')">Unselect</button>
            <MagicCookieProvider id="api-unselect">
              <MagicCookieItem id="uns-cookie" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          </div>
        `,
      })

      const screen = render(wrapper, {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId('select').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')

      await screen.getByTestId('unselect').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })

    it("toggleItem() toggles a cookie's active state", async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('api-toggle-item')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="toggleItem('tog-cookie')">Toggle</button>
            <MagicCookieProvider id="api-toggle-item">
              <MagicCookieItem id="tog-cookie" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          </div>
        `,
      })

      const screen = render(wrapper, {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')

      await screen.getByTestId('toggle').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')

      await screen.getByTestId('toggle').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('acceptAll', () => {
    it('acceptAll() sets all cookies to active', async () => {
      const screen = render(createWrapper('api-accept-all'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId('accept-all').click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      expect(cookies.analytics).toBe(true)
      expect(cookies.necessary).toBe(true)
    })

    it('acceptAll() marks all items as set', async () => {
      const screen = render(createWrapper('api-accept-set'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId('accept-all').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('cookies-set'))
        .toHaveTextContent('true')
    })
  })

  describe('rejectAll', () => {
    it('rejectAll() deactivates optional cookies', async () => {
      const screen = render(createWrapper('api-reject-all'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      // First select all
      await screen.getByTestId('accept-all').click()
      await nextTick()
      await nextTick()

      // Then reject
      await screen.getByTestId('reject-all').click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      expect(cookies.analytics).toBe(false)
    })

    it('rejectAll() keeps required cookies active', async () => {
      const screen = render(createWrapper('api-reject-required'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId('reject-all').click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      // Required cookies (optional=false) always return true
      expect(cookies.necessary).toBe(true)
    })
  })

  describe('acceptSelected', () => {
    it('acceptSelected() saves current selection', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('api-accept-selected')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="select" @click="selectItem('sel-analytics')">Select</button>
            <button data-test-id="accept" @click="acceptSelected">Accept Selected</button>
            <span data-test-id="cookies-set">{{ cookiesSet }}</span>
            <MagicCookieProvider id="api-accept-selected">
              <MagicCookieItem id="sel-analytics" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          </div>
        `,
      })

      const screen = render(wrapper, {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId('select').click()
      await nextTick()

      await screen.getByTestId('accept').click()
      await nextTick()

      await expect
        .element(page.getByTestId('cookies-set'))
        .toHaveTextContent('true')
    })
  })

  describe('cookies computed', () => {
    it('cookies reflects current consent state', async () => {
      const screen = render(createWrapper('api-cookies-state'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      // Optional defaults to false, required (optional=false) always true
      expect(cookies.analytics).toBe(false)
      expect(cookies.necessary).toBe(true)
    })
  })

  describe('cookiesSet', () => {
    it('cookiesSet is false initially', async () => {
      render(createWrapper('api-not-set'), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await expect
        .element(page.getByTestId('cookies-set'))
        .toHaveTextContent('false')
    })
  })
})
