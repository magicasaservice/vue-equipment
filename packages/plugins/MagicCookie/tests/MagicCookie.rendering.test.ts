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

describe('MagicCookie - Rendering', () => {
  describe('view component', () => {
    it('view inner is hidden (display:none) when view is not active', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.ViewHidden)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.ViewHidden}">
              <MagicCookieView>
                <div>Content</div>
              </MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly } } }
      )
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner).not.toBeNull()
      expect(inner.style.display).toBe('none')
    })

    it('view inner is visible when showView() is called', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            const { showView } = useMagicCookie(CookieId.ViewVisible)
            showView()
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.ViewVisible}">
              <MagicCookieView>
                <div>Visible</div>
              </MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()
      await nextTick()

      const inner = document.querySelector(
        '.magic-cookie-view__inner'
      ) as HTMLElement
      expect(inner).not.toBeNull()
      expect(inner.style.display).not.toBe('none')
    })

    it('exposes viewActive=true via scoped slot after showView()', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            const { showView } = useMagicCookie(CookieId.ScopedSlot)
            showView()
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.ScopedSlot}">
              <MagicCookieView>
                <template #default="{ viewActive }">
                  <span data-test-id="${TestId.SlotValue}">{{ viewActive }}</span>
                </template>
              </MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.SlotValue))
        .toHaveTextContent('true')
    })

    it('sets --mc-duration CSS variable to 300ms by default', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieView, ClientOnly },
          setup() {
            useMagicCookie(CookieId.CssVar)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.CssVar}">
              <MagicCookieView><div>Content</div></MagicCookieView>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly } } }
      )
      await nextTick()

      const view = document.querySelector('.magic-cookie-view') as HTMLElement
      expect(view.style.getPropertyValue('--mc-duration')).toBe('300ms')
    })
  })

  describe('item component', () => {
    it('sets data-id attribute from id prop', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.DataId)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.DataId}">
              <MagicCookieItem id="${ItemId.MyCookie}">
                <div>Cookie</div>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const item = document.querySelector('.magic-cookie-item')
      expect(item!.getAttribute('data-id')).toBe(ItemId.MyCookie)
    })

    it('sets data-optional=true and data-optional=false correctly', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.Optional)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.Optional}">
              <MagicCookieItem id="${ItemId.OptCookie}" :optional="true">
                <div>Optional</div>
              </MagicCookieItem>
              <MagicCookieItem id="${ItemId.ReqCookie}" :optional="false">
                <div>Required</div>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const items = document.querySelectorAll('.magic-cookie-item')
      expect(items[0]!.getAttribute('data-optional')).toBe('true')
      expect(items[1]!.getAttribute('data-optional')).toBe('false')
    })

    it('optional item has data-active=false by default', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.Active)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.Active}">
              <MagicCookieItem id="${ItemId.ActiveCookie}" :optional="true">
                <div>Cookie</div>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      const item = document.querySelector('.magic-cookie-item')
      expect(item!.getAttribute('data-active')).toBe('false')
    })

    it('exposes item data via scoped slot with correct values', async () => {
      render(
        defineComponent({
          components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
          setup() {
            useMagicCookie(CookieId.ItemSlot)
            return {}
          },
          template: `
            <MagicCookieProvider id="${CookieId.ItemSlot}">
              <MagicCookieItem id="${ItemId.SlotCookie}" :optional="false">
                <template #default="{ item }">
                  <span data-test-id="${TestId.ItemId}">{{ item.id }}</span>
                  <span data-test-id="${TestId.ItemActive}">{{ item.active }}</span>
                  <span data-test-id="${TestId.ItemOptional}">{{ item.optional }}</span>
                </template>
              </MagicCookieItem>
            </MagicCookieProvider>
          `,
        }),
        { global: { stubs: { ClientOnly, AutoSize } } }
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ItemId))
        .toHaveTextContent(ItemId.SlotCookie)
      await expect
        .element(page.getByTestId(TestId.ItemActive))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.ItemOptional))
        .toHaveTextContent('false')
    })
  })
})
