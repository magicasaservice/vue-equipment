import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicMenuProvider from '../src/components/MagicMenuProvider.vue'
import MagicMenuTrigger from '../src/components/MagicMenuTrigger.vue'
import MagicMenuView from '../src/components/MagicMenuView.vue'
import MagicMenuContent from '../src/components/MagicMenuContent.vue'
import MagicMenuItem from '../src/components/MagicMenuItem.vue'
import MagicMenuChannel from '../src/components/MagicMenuChannel.vue'
import MagicMenuRemote from '../src/components/MagicMenuRemote.vue'
import MagicMenuFloat from '../src/components/MagicMenuFloat.vue'
import { useMagicMenu } from '../src/composables/useMagicMenu'

const gc = {
  global: {
    components: {
      MagicMenuFloat,
      MagicMenuContent,
      MagicMenuChannel,
      MagicMenuItem,
      MagicMenuProvider,
      MagicMenuRemote,
      MagicMenuTrigger,
      MagicMenuView,
    },
  },
}

function createDropdown(id: string) {
  return defineComponent({
    components: {
      MagicMenuProvider,
      MagicMenuTrigger,
      MagicMenuView,
      MagicMenuContent,
      MagicMenuItem,
    },
    setup() {
      useMagicMenu({ instanceId: id, viewId: 'view-0' })
      return {}
    },
    template: `
      <MagicMenuProvider id="${id}" :options="{ mode: 'dropdown' }">
        <MagicMenuView>
          <MagicMenuTrigger>
            <button data-test-id="trigger">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem>
              <div data-test-id="item-1">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem>
              <div data-test-id="item-2">Item 2</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

describe('MagicMenu - Rendering', () => {
  describe('provider', () => {
    it('renders with correct class', async () => {
      render(createDropdown('render-provider'), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-menu-provider')
      ).not.toBeNull()
    })

    it('sets data-id', async () => {
      render(createDropdown('render-data-id'), gc)
      await nextTick()

      const el = document.querySelector('.magic-menu-provider')
      expect(el!.getAttribute('data-id')).toBe('render-data-id')
    })
  })

  describe('trigger', () => {
    it('renders with correct class', async () => {
      render(createDropdown('render-trigger'), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-menu-trigger')
      ).not.toBeNull()
    })

    it('has data-active=false by default', async () => {
      render(createDropdown('render-trigger-active'), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('false')
    })

    it('has data-disabled attribute', async () => {
      render(createDropdown('render-trigger-disabled'), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('false')
    })

    it('first trigger has tabindex=0', async () => {
      render(createDropdown('render-trigger-tab'), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('tabindex')).toBe('0')
    })

    it('renders slot content', async () => {
      render(createDropdown('render-trigger-slot'), gc)
      await nextTick()

      await expect
        .element(page.getByTestId('trigger'))
        .toHaveTextContent('Open')
    })
  })

  describe('view', () => {
    it('renders with correct class', async () => {
      render(createDropdown('render-view'), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-menu-view')
      ).not.toBeNull()
    })

    it('has data-id attribute', async () => {
      render(createDropdown('render-view-id'), gc)
      await nextTick()

      const view = document.querySelector('.magic-menu-view')
      expect(view!.hasAttribute('data-id')).toBe(true)
    })
  })

  describe('content (closed)', () => {
    it('content not rendered when menu closed', async () => {
      render(createDropdown('render-content-closed'), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-menu-content')
      ).toBeNull()
    })
  })

  describe('content (open)', () => {
    it('content renders when trigger clicked', async () => {
      const screen = render(createDropdown('render-content-open'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      expect(
        document.querySelector('.magic-menu-content')
      ).not.toBeNull()
    })

    it('content has data-id attribute', async () => {
      const screen = render(createDropdown('render-content-id'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const content = document.querySelector('.magic-menu-content')
      expect(content!.hasAttribute('data-id')).toBe(true)
    })

    it('content inner has pointer-disabled attr', async () => {
      const screen = render(createDropdown('render-content-inner'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const inner = document.querySelector('.magic-menu-content__inner')
      expect(inner).not.toBeNull()
      expect(inner!.hasAttribute('data-pointer-disabled')).toBe(true)
    })
  })

  describe('item', () => {
    it('item renders when menu open', async () => {
      const screen = render(createDropdown('render-item'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const items = document.querySelectorAll('.magic-menu-item')
      expect(items.length).toBe(2)
    })

    it('item has data-active=false by default', async () => {
      const screen = render(createDropdown('render-item-active'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('.magic-menu-item')
      expect(item!.getAttribute('data-active')).toBe('false')
    })

    it('item has data-disabled attribute', async () => {
      const screen = render(createDropdown('render-item-disabled'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('.magic-menu-item')
      expect(item!.getAttribute('data-disabled')).toBe('false')
    })

    it('item renders slot content', async () => {
      const screen = render(createDropdown('render-item-slot'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      await expect
        .element(page.getByTestId('item-1'))
        .toHaveTextContent('Item 1')
    })
  })

  describe('float', () => {
    it('float renders inside content', async () => {
      const screen = render(createDropdown('render-float'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      expect(
        document.querySelector('.magic-menu-float')
      ).not.toBeNull()
    })
  })

  describe('disabled trigger', () => {
    it('renders with data-disabled=true', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'render-disabled-trigger', viewId: 'view-0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="render-disabled-trigger" :options="{ mode: 'dropdown' }">
            <MagicMenuView>
              <MagicMenuTrigger :disabled="true">
                <button data-test-id="trigger">Disabled</button>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Item</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('true')
    })
  })
})
