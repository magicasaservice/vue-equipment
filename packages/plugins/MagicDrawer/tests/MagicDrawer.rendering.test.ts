import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTrigger from '../src/components/MagicDrawerTrigger.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { DrawerId, TestId } from './enums'

function createDrawer(id: DrawerId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <MagicDrawerTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicDrawerTrigger>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div data-test-id="${TestId.DrawerContent}">Content</div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
    data() { return { options } },
  })
}

async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
  await nextTick()
}

describe('MagicDrawer - Rendering', () => {
  describe('trigger', () => {
    it('has .magic-drawer-trigger class', () => {
      render(createDrawer(DrawerId.RenderTrigger))
      expect(document.querySelector('.magic-drawer-trigger')).not.toBeNull()
    })

    it('has data-active=false initially', () => {
      render(createDrawer(DrawerId.RenderTriggerActive))
      expect(document.querySelector('.magic-drawer-trigger')!.getAttribute('data-active')).toBe('false')
    })

    it('has data-disabled=false by default', () => {
      render(createDrawer(DrawerId.RenderTriggerDisabled))
      expect(document.querySelector('.magic-drawer-trigger')!.getAttribute('data-disabled')).toBe('false')
    })

    it('data-active becomes true when open', async () => {
      const screen = render(createDrawer(DrawerId.RenderTriggerOpen))
      await open(screen)
      expect(document.querySelector('.magic-drawer-trigger')!.getAttribute('data-active')).toBe('true')
    })
  })

  describe('content (closed)', () => {
    it('does not render when inactive', () => {
      render(createDrawer(DrawerId.RenderContentClosed))
      expect(document.querySelector('.magic-drawer-content')).toBeNull()
    })
  })

  describe('content (open)', () => {
    it('renders correct structure', async () => {
      const screen = render(createDrawer(DrawerId.RenderContentOpen))
      await open(screen)

      const drawer = document.querySelector('.magic-drawer-content')
      expect(drawer).not.toBeNull()
      expect(drawer!.querySelector('.magic-drawer-content__wrapper')).not.toBeNull()
      expect(drawer!.querySelector('.magic-drawer-content__inner')).not.toBeNull()
      expect(drawer!.querySelector('.magic-drawer-content__drag')).not.toBeNull()
    })

    it('sets data-id', async () => {
      const screen = render(createDrawer(DrawerId.RenderDataId))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-id')).toBe(DrawerId.RenderDataId)
    })

    it('sets data-position to bottom by default', async () => {
      const screen = render(createDrawer(DrawerId.RenderPosition))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-position')).toBe('bottom')
    })

    it('sets aria-modal', async () => {
      const screen = render(createDrawer(DrawerId.RenderAriaModal))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('aria-modal')).toBe('true')
    })

    it('drag uses dialog by default', async () => {
      const screen = render(createDrawer(DrawerId.RenderTag))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content__drag')!.tagName.toLowerCase()).toBe('dialog')
    })

    it('renders slot content', async () => {
      const screen = render(createDrawer(DrawerId.RenderSlot))
      await open(screen)
      await expect.element(page.getByTestId(TestId.DrawerContent)).toBeInTheDocument()
    })

    it('sets data-disabled from options', async () => {
      const screen = render(createDrawer(DrawerId.RenderDisabled, { disabled: true }))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-disabled')).toBe('true')
    })

    it('data-dragging is false when not dragging', async () => {
      const screen = render(createDrawer(DrawerId.RenderDragging))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-dragging')).toBe('false')
    })
  })

  describe('backdrop', () => {
    it('renders when drawer is open', async () => {
      const screen = render(createDrawer(DrawerId.RenderBackdrop))
      await open(screen)
      expect(document.querySelector('.magic-drawer-backdrop')).not.toBeNull()
    })
  })
})
