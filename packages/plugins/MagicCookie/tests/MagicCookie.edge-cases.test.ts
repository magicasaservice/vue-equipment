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

describe('MagicCookie - Edge Cases', () => {
  describe('auto-generated IDs', () => {
    it('generates an ID when none is provided', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          useMagicCookie('edge-auto-id')
          return {}
        },
        template: `
          <MagicCookieProvider id="edge-auto-id">
            <MagicCookieItem>
              <template #default="{ item }">
                <span data-test-id="item-id">{{ item.id }}</span>
              </template>
            </MagicCookieItem>
          </MagicCookieProvider>
        `,
      })

      render(wrapper, { global: { stubs: { ClientOnly } } })
      await nextTick()

      const id = document.querySelector(
        '[data-test-id="item-id"]'
      )!.textContent
      expect(id).toBeTruthy()
      expect(id!.startsWith('magic-cookie-item-')).toBe(true)
    })
  })

  describe('required cookie protection', () => {
    it('required cookies cannot be rejected', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-required')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="reject" @click="rejectAll">Reject</button>
            <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="edge-required">
              <MagicCookieItem id="required-cookie" :optional="false">
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

      await screen.getByTestId('reject').click()
      await nextTick()
      await nextTick()

      // cookies computed always returns true for required cookies
      const cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      expect(cookies['required-cookie']).toBe(true)
    })
  })

  describe('multiple items', () => {
    it('handles multiple items independently', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-multi-items')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="select-a" @click="selectItem('cookie-a')">Select A</button>
            <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="edge-multi-items">
              <MagicCookieItem id="cookie-a" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="a-active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
              <MagicCookieItem id="cookie-b" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="b-active">{{ item.active }}</span>
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

      // Select only cookie-a
      await screen.getByTestId('select-a').click()
      await nextTick()

      await expect
        .element(page.getByTestId('a-active'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('b-active'))
        .toHaveTextContent('false')
    })
  })

  describe('item cleanup on unmount', () => {
    it('removes item from state when unmounted', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-cleanup')
          return { ...api }
        },
        data() {
          return { showItem: true }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="showItem = !showItem">Toggle</button>
            <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="edge-cleanup">
              <MagicCookieItem v-if="showItem" id="temp-cookie" :optional="true">
                <div>Temp</div>
              </MagicCookieItem>
              <MagicCookieItem id="permanent-cookie" :optional="true">
                <div>Permanent</div>
              </MagicCookieItem>
            </MagicCookieProvider>
          </div>
        `,
      })

      const screen = render(wrapper, {
        global: { stubs: { ClientOnly, AutoSize } },
      })
      await nextTick()

      // Both items exist initially
      let cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      expect('temp-cookie' in cookies).toBe(true)
      expect('permanent-cookie' in cookies).toBe(true)

      // Unmount temp-cookie
      await screen.getByTestId('toggle').click()
      await nextTick()

      cookies = JSON.parse(
        document.querySelector('[data-test-id="cookies"]')!
          .textContent || '{}'
      )
      expect('temp-cookie' in cookies).toBe(false)
      expect('permanent-cookie' in cookies).toBe(true)
    })
  })

  describe('rapid state changes', () => {
    it("rapid select/unselect doesn't break state", async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-rapid')

          function rapidToggle() {
            api.selectItem('rapid-cookie')
            api.unselectItem('rapid-cookie')
            api.selectItem('rapid-cookie')
            api.unselectItem('rapid-cookie')
            api.selectItem('rapid-cookie') // final: active
          }

          return { ...api, rapidToggle }
        },
        template: `
          <div>
            <button data-test-id="rapid" @click="rapidToggle">Rapid</button>
            <MagicCookieProvider id="edge-rapid">
              <MagicCookieItem id="rapid-cookie" :optional="true">
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

      await screen.getByTestId('rapid').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })

  describe('acceptAll then rejectAll sequence', () => {
    it('correctly transitions from all accepted to all rejected', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-sequence')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="accept" @click="acceptAll">Accept</button>
            <button data-test-id="reject" @click="rejectAll">Reject</button>
            <span data-test-id="cookies">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="edge-sequence">
              <MagicCookieItem id="seq-opt" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="opt-active">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
              <MagicCookieItem id="seq-req" :optional="false">
                <template #default="{ item }">
                  <span data-test-id="req-active">{{ item.active }}</span>
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

      // Accept all
      await screen.getByTestId('accept').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('opt-active'))
        .toHaveTextContent('true')

      // Reject all
      await screen.getByTestId('reject').click()
      await nextTick()
      await nextTick()

      // Optional gets deactivated, required stays active
      await expect
        .element(page.getByTestId('opt-active'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('req-active'))
        .toHaveTextContent('true')
    })
  })

  describe('zero options', () => {
    it('works with no options specified', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie('edge-no-opts')
          api.showView()
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="accept" @click="acceptAll">Accept</button>
            <MagicCookieProvider id="edge-no-opts">
              <MagicCookieView>
                <div data-test-id="view">Banner</div>
              </MagicCookieView>
              <MagicCookieItem id="basic-cookie">
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
      await nextTick()

      await expect
        .element(page.getByTestId('view'))
        .toBeVisible()

      await screen.getByTestId('accept').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })
})
