import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCookieProvider from '../src/components/MagicCookieProvider.vue'
import MagicCookieView from '../src/components/MagicCookieView.vue'
import MagicCookieItem from '../src/components/MagicCookieItem.vue'
import { useMagicCookie } from '../src/composables/useMagicCookie'
import { CookieId, ItemId, TestId } from './enums'

// ─── Stubs ────────────────────────────────────────────────────────────────────

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  template: '<slot />',
})

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

// ─── Factory ──────────────────────────────────────────────────────────────────

function createWrapper(
  cookieId: CookieId,
  items: Array<{ id: string; optional?: boolean }> = [
    { id: ItemId.Analytics, optional: true },
    { id: ItemId.Necessary, optional: false },
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
        <button data-test-id="${TestId.ShowView}" @click="showView">Show</button>
        <button data-test-id="${TestId.HideView}" @click="hideView">Hide</button>
        <button data-test-id="${TestId.ToggleView}" @click="toggleView">Toggle</button>
        <button data-test-id="${TestId.AcceptAll}" @click="acceptAll">Accept All</button>
        <button data-test-id="${TestId.RejectAll}" @click="rejectAll">Reject All</button>
        <button data-test-id="${TestId.AcceptSelected}" @click="acceptSelected">Accept Selected</button>
        <span data-test-id="${TestId.Cookies}">{{ JSON.stringify(cookies) }}</span>
        <span data-test-id="${TestId.CookiesSet}">{{ cookiesSet }}</span>
        <MagicCookieProvider id="${cookieId}">
          <MagicCookieView>
            <div>Cookie Banner</div>
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicCookie - API', () => {
  describe('view management', () => {
    it('showView() makes the view visible', async () => {
      const screen = render(createWrapper(CookieId.Show), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      await screen.getByTestId(TestId.ShowView).click()
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner.style.display).not.toBe('none')
    })

    it('hideView() hides the view', async () => {
      const screen = render(createWrapper(CookieId.Hide), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      await screen.getByTestId(TestId.ShowView).click()
      await nextTick()

      await screen.getByTestId(TestId.HideView).click()
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner.style.display).toBe('none')
    })

    it('toggleView() toggles visibility', async () => {
      const screen = render(createWrapper(CookieId.Toggle), {
        global: { stubs: { ClientOnly, AutoSize } },
      })

      const inner = () =>
        document.querySelector('.magic-cookie-view__inner') as HTMLElement

      expect(inner().style.display).toBe('none')

      await screen.getByTestId(TestId.ToggleView).click()
      await nextTick()
      expect(inner().style.display).not.toBe('none')

      await screen.getByTestId(TestId.ToggleView).click()
      await nextTick()
      expect(inner().style.display).toBe('none')
    })
  })

  describe('item selection', () => {
    it('selectItem() activates a cookie', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Select)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Select}" @click="selectItem('${ItemId.MyCookie}')">Select</button>
            <MagicCookieProvider id="${CookieId.Select}">
              <MagicCookieItem id="${ItemId.MyCookie}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
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
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Select).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })

    it('unselectItem() deactivates a cookie', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Unselect)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Select}" @click="selectItem('${ItemId.UnsCookie}')">Select</button>
            <button data-test-id="${TestId.Unselect}" @click="unselectItem('${ItemId.UnsCookie}')">Unselect</button>
            <MagicCookieProvider id="${CookieId.Unselect}">
              <MagicCookieItem id="${ItemId.UnsCookie}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
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

      await screen.getByTestId(TestId.Select).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Unselect).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })

    it("toggleItem() toggles a cookie's active state", async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.ToggleItem)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Toggle}" @click="toggleItem('${ItemId.TogCookie}')">Toggle</button>
            <MagicCookieProvider id="${CookieId.ToggleItem}">
              <MagicCookieItem id="${ItemId.TogCookie}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
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
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('acceptAll', () => {
    it('acceptAll() sets all cookies to active', async () => {
      const screen = render(createWrapper(CookieId.AcceptAll), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId(TestId.AcceptAll).click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(cookies[ItemId.Analytics]).toBe(true)
      expect(cookies[ItemId.Necessary]).toBe(true)
    })

    it('acceptAll() sets cookiesSet to true', async () => {
      const screen = render(createWrapper(CookieId.AcceptSet), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId(TestId.AcceptAll).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CookiesSet))
        .toHaveTextContent('true')
    })
  })

  describe('rejectAll', () => {
    it('rejectAll() deactivates optional cookies', async () => {
      const screen = render(createWrapper(CookieId.RejectAll), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId(TestId.AcceptAll).click()
      await nextTick()
      await nextTick()

      await screen.getByTestId(TestId.RejectAll).click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(cookies[ItemId.Analytics]).toBe(false)
    })

    it('rejectAll() keeps required cookies active', async () => {
      const screen = render(createWrapper(CookieId.RejectRequired), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await screen.getByTestId(TestId.RejectAll).click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(cookies[ItemId.Necessary]).toBe(true)
    })
  })

  describe('acceptSelected', () => {
    it('acceptSelected() saves current selection and sets cookiesSet=true', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.AcceptSelected)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Select}" @click="selectItem('${ItemId.SelAnalytics}')">Select</button>
            <button data-test-id="${TestId.AcceptSelected}" @click="acceptSelected">Accept Selected</button>
            <span data-test-id="${TestId.CookiesSet}">{{ cookiesSet }}</span>
            <MagicCookieProvider id="${CookieId.AcceptSelected}">
              <MagicCookieItem id="${ItemId.SelAnalytics}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
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

      await screen.getByTestId(TestId.Select).click()
      await nextTick()

      await screen.getByTestId(TestId.AcceptSelected).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CookiesSet))
        .toHaveTextContent('true')
    })
  })

  describe('cookies computed', () => {
    it('cookies reflects initial state: optional=false, required=true', async () => {
      render(createWrapper(CookieId.CookiesState), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(cookies[ItemId.Analytics]).toBe(false)
      expect(cookies[ItemId.Necessary]).toBe(true)
    })
  })

  describe('cookiesSet', () => {
    it('cookiesSet is false before any accept/reject', async () => {
      render(createWrapper(CookieId.NotSet), {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CookiesSet))
        .toHaveTextContent('false')
    })
  })
})
