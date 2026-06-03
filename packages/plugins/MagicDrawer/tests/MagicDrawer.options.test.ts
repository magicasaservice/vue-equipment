import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTrigger from '../src/components/MagicDrawerTrigger.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

function createDrawer(id: DrawerId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const { isActive } = useMagicDrawer(id)
      return { isActive }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawerTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicDrawerTrigger>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div data-test-id="${TestId.DrawerContent}" style="height: 200px; width: 100%;"><button>Focusable</button></div>
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
  await new Promise((r) => setTimeout(r, 50))
}

describe('MagicDrawer - Options', () => {
  describe('position', () => {
    const positions = [
      { key: 'top' as const, id: DrawerId.PositionTop },
      { key: 'right' as const, id: DrawerId.PositionRight },
      { key: 'bottom' as const, id: DrawerId.PositionBottom },
      { key: 'left' as const, id: DrawerId.PositionLeft },
    ]

    for (const { key, id } of positions) {
      it(`renders with data-position="${key}"`, async () => {
        const screen = render(createDrawer(id, { position: key }))
        await open(screen)
        expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-position')).toBe(key)
      })
    }
  })

  describe('tag', () => {
    it('tag: dialog (default) uses dialog element', async () => {
      const screen = render(createDrawer(DrawerId.OptTagDialog))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content__drag')!.tagName.toLowerCase()).toBe('dialog')
    })

    it('tag: div uses div element', async () => {
      const screen = render(createDrawer(DrawerId.OptTagDiv, { tag: 'div' }))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content__drag')!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('teleport', () => {
    it('teleport.disabled prevents teleportation', async () => {
      const screen = render(createDrawer(DrawerId.TeleportDisabled, { teleport: { disabled: true } }))
      await open(screen)

      expect(document.querySelector('.magic-drawer-content')).not.toBeNull()
      expect(document.body.querySelector(':scope > .magic-drawer-content')).toBeNull()
    })

    it('teleport to custom target', async () => {
      const target = document.createElement('div')
      target.id = 'custom-target'
      document.body.appendChild(target)

      const screen = render(createDrawer(DrawerId.TeleportCustom, { teleport: { target: '#custom-target' } }))
      await open(screen)

      expect(target.querySelector('.magic-drawer-content')).not.toBeNull()
      document.body.removeChild(target)
    })
  })

  describe('disabled', () => {
    it('disabled: true sets data-disabled to true', async () => {
      const screen = render(createDrawer(DrawerId.DisabledTrue, { disabled: true }))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-disabled')).toBe('true')
    })

    it('disabled: false sets data-disabled to false', async () => {
      const screen = render(createDrawer(DrawerId.DisabledFalse, { disabled: false }))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-disabled')).toBe('false')
    })
  })

  describe('snapPoints', () => {
    it('renders with percentage snap points', async () => {
      const screen = render(createDrawer(DrawerId.SnapPercent, { snapPoints: [0.5, 1] }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('renders with pixel snap points', async () => {
      const screen = render(createDrawer(DrawerId.SnapPx, { snapPoints: ['200px', '400px'] }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('renders with mixed snap points', async () => {
      const screen = render(createDrawer(DrawerId.SnapMixed, { snapPoints: ['320px', 0.75, 1] }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('scrollLock', () => {
    it('scrollLock: true — drawer opens successfully', async () => {
      const screen = render(createDrawer(DrawerId.ScrollLock, { scrollLock: true }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('scrollLock: false does not lock document scroll', async () => {
      const screen = render(createDrawer(DrawerId.NoScrollLock, { scrollLock: false }))
      await open(screen)
      await new Promise((r) => setTimeout(r, 400))
      expect(document.documentElement.style.overflow).not.toBe('hidden')
    })
  })

  describe('transition', () => {
    it('custom transition names are accepted without error', async () => {
      const screen = render(createDrawer(DrawerId.CustomTransition, { transition: { content: 'custom-content', backdrop: 'custom-backdrop' } }))
      await open(screen)
      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('initial', () => {
    it('initial.open: true opens on mount', async () => {
      render(createDrawer(DrawerId.InitialOpen, { initial: { open: true } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })

    it('initial.open: false does not open on mount', () => {
      render(createDrawer(DrawerId.InitialClosed, { initial: { open: false } }))
      expect(document.querySelector('.magic-drawer-content')).toBeNull()
    })

    it('initial.transition: false suppresses mount animation', async () => {
      render(createDrawer(DrawerId.InitialNoAnim, { initial: { open: true, transition: false } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect.element(page.getByTestId(TestId.IsActive)).toHaveTextContent('true')
    })
  })

  describe('enableMousewheel', () => {
    it('enableMousewheel: false — data-wheeling is false', async () => {
      const screen = render(createDrawer(DrawerId.NoWheel, { enableMousewheel: false }))
      await open(screen)
      expect(document.querySelector('.magic-drawer-content')!.getAttribute('data-wheeling')).toBe('false')
    })
  })
})
