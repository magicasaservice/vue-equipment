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

describe('MagicCookie - Options', () => {
  describe('maxAge', () => {
    it('uses default maxAge (24 * 60 * 60 * 60) when not specified', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.MaxAgeDefault)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.MaxAgeDefault}">
              <MagicCookieItem id="${ItemId.AgeCookie}">
                <template #default="{ item }">
                  <span data-test-id="${TestId.ItemData}">{{ JSON.stringify(item) }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const data = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.ItemData}"]`)!
          .textContent || '{}'
      )
      expect(data.maxAge).toBe(24 * 60 * 60 * 60)
    })

    it('item-level maxAge overrides provider default', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.MaxAgeOverride)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.MaxAgeOverride}">
              <MagicCookieItem id="${ItemId.CustomAge}" :max-age="3600">
                <template #default="{ item }">
                  <span data-test-id="${TestId.ItemData}">{{ JSON.stringify(item) }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const data = JSON.parse(
        document.querySelector(`[data-test-id="${TestId.ItemData}"]`)!
          .textContent || '{}'
      )
      expect(data.maxAge).toBe(3600)
    })
  })

  describe('transition', () => {
    it('custom transition option allows content to be visible', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            const { showView } = useMagicCookie(CookieId.TransitionCustom)
            showView()
            return {}
          },
          template: `
            <MagicCookieProvider
              id="${CookieId.TransitionCustom}"
              :options="{ transition: 'my-custom-transition' }"
            >
              <MagicCookieView>
                <div data-test-id="${TestId.CustomContent}">Content</div>
              </MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CustomContent))
        .toBeVisible()
    })
  })

  describe('animation', () => {
    it('custom animation.duration is applied as --mc-duration CSS variable', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            useMagicCookie(CookieId.AnimDuration)
            return {}
          },
          template: `
            <MagicCookieProvider
              id="${CookieId.AnimDuration}"
              :options="{ animation: { duration: 500, easing: (t) => t } }"
            >
              <MagicCookieView><div>Content</div></MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const view = document.querySelector('.magic-cookie-view') as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('500ms')
    })

    it('default animation duration is 300ms', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            useMagicCookie(CookieId.AnimDefault)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.AnimDefault}">
              <MagicCookieView><div>Content</div></MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const view = document.querySelector('.magic-cookie-view') as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('300ms')
    })
  })

  describe('optional vs required items', () => {
    it('optional items default to inactive', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.OptionalDefault)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.OptionalDefault}">
              <MagicCookieItem id="${ItemId.OptCookie}" :optional="true">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })

    it('required items default to active', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.RequiredDefault)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.RequiredDefault}">
              <MagicCookieItem id="${ItemId.ReqCookie}" :optional="false">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })

    it('omitting :optional prop treats item as required (Vue boolean casting → false)', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.OptionalUnset)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.OptionalUnset}">
              <MagicCookieItem id="${ItemId.UnsetCookie}">
                <template #default="{ item }">
                  <span data-test-id="${TestId.Optional}">{{ item.optional }}</span>
                  <span data-test-id="${TestId.Active}">{{ item.active }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Optional))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })
})
