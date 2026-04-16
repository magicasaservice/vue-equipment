import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'

import { defineComponent, nextTick } from 'vue'
import MagicMenuProvider from '../src/components/MagicMenuProvider.vue'
import MagicMenuTrigger from '../src/components/MagicMenuTrigger.vue'
import MagicMenuView from '../src/components/MagicMenuView.vue'
import MagicMenuContent from '../src/components/MagicMenuContent.vue'
import MagicMenuItem from '../src/components/MagicMenuItem.vue'
import MagicMenuFloat from '../src/components/MagicMenuFloat.vue'
import MagicMenuChannel from '../src/components/MagicMenuChannel.vue'
import MagicMenuRemote from '../src/components/MagicMenuRemote.vue'
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
      useMagicMenu({ instanceId: id, viewId: 'v0' })
      return {}
    },
    template: `
      <MagicMenuProvider id="${id}" :options="{ mode: 'dropdown' }">
        <MagicMenuView id="v0">
          <MagicMenuTrigger>
            <button data-test-id="trigger">Open</button>
          </MagicMenuTrigger>
          <MagicMenuContent :teleport="{ disabled: true }">
            <MagicMenuItem id="item-1">
              <div data-test-id="item-1">Item 1</div>
            </MagicMenuItem>
            <MagicMenuItem id="item-2">
              <div data-test-id="item-2">Item 2</div>
            </MagicMenuItem>
            <MagicMenuItem id="item-3" :disabled="true">
              <div data-test-id="item-3">Item 3 (disabled)</div>
            </MagicMenuItem>
          </MagicMenuContent>
        </MagicMenuView>
      </MagicMenuProvider>
    `,
  })
}

describe('MagicMenu - Interactions', () => {
  describe('trigger click', () => {
    it('clicking trigger opens dropdown', async () => {
      const screen = render(createDropdown('int-trigger-click'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })

    it('clicking trigger again closes dropdown', async () => {
      const screen = render(createDropdown('int-trigger-toggle'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      await screen.getByTestId('trigger').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })

    it('trigger data-active becomes true on open', async () => {
      const screen = render(createDropdown('int-trigger-active'), gc)
      await nextTick()

      const trigger = document.querySelector('.magic-menu-trigger')
      expect(trigger!.getAttribute('data-active')).toBe('false')

      await screen.getByTestId('trigger').click()
      await nextTick()

      expect(trigger!.getAttribute('data-active')).toBe('true')
    })
  })

  describe('item hover', () => {
    it('mouseenter on item sets data-active=true', async () => {
      const screen = render(createDropdown('int-item-hover'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('[data-id="item-1"]') as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      expect(item.getAttribute('data-active')).toBe('true')
    })

    it('mouseleave on item resets active', async () => {
      const screen = render(createDropdown('int-item-leave'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('[data-id="item-1"]') as HTMLElement
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      expect(item.getAttribute('data-active')).toBe('false')
    })
  })

  describe('item click', () => {
    it('clicking item closes menu', async () => {
      const screen = render(createDropdown('int-item-click'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('[data-id="item-1"]') as HTMLElement
      item.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })

  describe('disabled item', () => {
    it('disabled item has data-disabled=true', async () => {
      const screen = render(createDropdown('int-item-disabled'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()

      const item = document.querySelector('[data-id="item-3"]')
      expect(item!.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('context menu', () => {
    it('right-click opens context menu', async () => {
      const wrapper = defineComponent({
        components: {
          MagicMenuProvider,
          MagicMenuTrigger,
          MagicMenuView,
          MagicMenuContent,
          MagicMenuItem,
        },
        setup() {
          useMagicMenu({ instanceId: 'int-context', viewId: 'v0' })
          return {}
        },
        template: `
          <MagicMenuProvider id="int-context" :options="{ mode: 'context' }">
            <MagicMenuView id="v0">
              <MagicMenuTrigger>
                <div data-test-id="area" style="width: 200px; height: 200px;">Right click here</div>
              </MagicMenuTrigger>
              <MagicMenuContent :teleport="{ disabled: true }">
                <MagicMenuItem><div>Cut</div></MagicMenuItem>
                <MagicMenuItem><div>Copy</div></MagicMenuItem>
              </MagicMenuContent>
            </MagicMenuView>
          </MagicMenuProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const area = document.querySelector('[data-test-id="area"]') as HTMLElement
      area.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          button: 2,
          clientX: 100,
          clientY: 100,
        })
      )
      // onOpen() is async: wrapperActive → nextTick → innerActive → nextTick
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(document.querySelector('.magic-menu-content')).not.toBeNull()
    })
  })

  describe('escape key', () => {
    it('pressing Escape closes menu', async () => {
      const screen = render(createDropdown('int-escape'), gc)
      await nextTick()

      await screen.getByTestId('trigger').click()
      await nextTick()
      expect(document.querySelector('.magic-menu-content')).not.toBeNull()

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      expect(document.querySelector('.magic-menu-content')).toBeNull()
    })
  })
})
