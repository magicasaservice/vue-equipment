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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicCookie - Edge Cases', () => {
  describe('auto-generated IDs', () => {
    it('item without id gets auto-generated id starting with "magic-cookie-item-"', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.AutoId)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.AutoId}">
              <MagicCookieItem>
                <template #default="{ item }">
                  <span data-test-id="${TestId.ItemId}">{{ item.id }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly } } }
      )
      await nextTick()

      const id = document.querySelector(
        `[data-test-id="${TestId.ItemId}"]`
      )!.textContent
      expect(id).toBeTruthy()
      expect(id!.startsWith('magic-cookie-item-')).toBe(true)
    })
  })

  describe('required cookie protection', () => {
    it('required cookies always return true in cookies computed after rejectAll()', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Required)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Reject}" @click="rejectAll">Reject</button>
            <span data-test-id="${TestId.Cookies}">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="${CookieId.Required}">
              <MagicCookieItem id="${ItemId.RequiredCookie}" :optional="false">
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

      await screen.getByTestId(TestId.Reject).click()
      await nextTick()
      await nextTick()

      const cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(cookies[ItemId.RequiredCookie]).toBe(true)
    })
  })

  describe('multiple items', () => {
    it('selecting one item does not affect another', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.MultiItems)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.SelectA}" @click="selectItem('${ItemId.CookieA}')">Select A</button>
            <MagicCookieProvider id="${CookieId.MultiItems}">
              <MagicCookieItem id="${ItemId.CookieA}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.AActive}">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
              <MagicCookieItem id="${ItemId.CookieB}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.BActive}">{{ item.active }}</span>
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

      await screen.getByTestId(TestId.SelectA).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.AActive))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.BActive))
        .toHaveTextContent('false')
    })
  })

  describe('item cleanup on unmount', () => {
    it('unmounted item is removed from cookies computed', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Cleanup)
          return { ...api }
        },
        data() {
          return { showItem: true }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Toggle}" @click="showItem = !showItem">Toggle</button>
            <span data-test-id="${TestId.Cookies}">{{ JSON.stringify(cookies) }}</span>
            <MagicCookieProvider id="${CookieId.Cleanup}">
              <MagicCookieItem v-if="showItem" id="${ItemId.TempCookie}" :optional="true">
                <div>Temp</div>
              </MagicCookieItem>
              <MagicCookieItem id="${ItemId.PermanentCookie}" :optional="true">
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

      let cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(ItemId.TempCookie in cookies).toBe(true)
      expect(ItemId.PermanentCookie in cookies).toBe(true)

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      cookies = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.Cookies}"]`)!
          .textContent || '{}'
      )
      expect(ItemId.TempCookie in cookies).toBe(false)
      expect(ItemId.PermanentCookie in cookies).toBe(true)
    })
  })

  describe('rapid state changes', () => {
    it("rapid select/unselect settles to final state", async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Rapid)

          function rapidToggle() {
            api.selectItem(ItemId.RapidCookie)
            api.unselectItem(ItemId.RapidCookie)
            api.selectItem(ItemId.RapidCookie)
            api.unselectItem(ItemId.RapidCookie)
            api.selectItem(ItemId.RapidCookie) // final: active
          }

          return { ...api, rapidToggle }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Rapid}" @click="rapidToggle">Rapid</button>
            <MagicCookieProvider id="${CookieId.Rapid}">
              <MagicCookieItem id="${ItemId.RapidCookie}" :optional="true">
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

      await screen.getByTestId(TestId.Rapid).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('acceptAll then rejectAll sequence', () => {
    it('optional deactivates after accept→reject; required stays active', async () => {
      const wrapper = defineComponent({
        components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
        setup() {
          const api = useMagicCookie(CookieId.Sequence)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Accept}" @click="acceptAll">Accept</button>
            <button data-test-id="${TestId.Reject}" @click="rejectAll">Reject</button>
            <MagicCookieProvider id="${CookieId.Sequence}">
              <MagicCookieItem id="${ItemId.SeqOpt}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.OptActive}">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
              <MagicCookieItem id="${ItemId.SeqReq}" :optional="false">
                <template #default="{ item }">
                  <span data-test-id="${TestId.ReqActive}">{{ item.active }}</span>
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

      await screen.getByTestId(TestId.Accept).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.OptActive))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Reject).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.OptActive))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.ReqActive))
        .toHaveTextContent('true')
    })
  })

  describe('zero options', () => {
    it('works with no options specified: view shows, acceptAll activates item', async () => {
      const wrapper = defineComponent({
        components: {
          MagicCookieProvider,
          MagicCookieView,
          MagicCookieItem,
          ClientOnly,
        },
        setup() {
          const api = useMagicCookie(CookieId.NoOpts)
          api.showView()
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Accept}" @click="acceptAll">Accept</button>
            <MagicCookieProvider id="${CookieId.NoOpts}">
              <MagicCookieView>
                <div data-test-id="${TestId.View}">Banner</div>
              </MagicCookieView>
              <MagicCookieItem id="${ItemId.BasicCookie}">
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
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.View))
        .toBeVisible()

      await screen.getByTestId(TestId.Accept).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })
})
