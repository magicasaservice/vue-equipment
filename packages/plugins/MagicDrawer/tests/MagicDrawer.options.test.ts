import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { DrawerId, TestId } from './enums'

// ─── Factory ─────────────────────────────────────────────────────────────────

function createWrapper(
  drawerId: DrawerId,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive } = useMagicDrawer(drawerId)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-test-id="${TestId.DrawerContent}" style="height: 200px; width: 100%;"><button>Focusable</button></div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

async function openDrawer(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.OpenBtn).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

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
        const screen = render(createWrapper(id, { position: key }))
        await openDrawer(screen)

        const drawer = document.querySelector('.magic-drawer')
        expect(drawer!.getAttribute('data-position')).toBe(key)
      })
    }
  })

  describe('backdrop', () => {
    it('backdrop: true renders backdrop element', async () => {
      const screen = render(createWrapper(DrawerId.BackdropTrue, { backdrop: true }))
      await openDrawer(screen)

      expect(document.querySelector('.magic-drawer__backdrop')).not.toBeNull()
    })

    it('backdrop: false removes backdrop element', async () => {
      const screen = render(createWrapper(DrawerId.BackdropFalse, { backdrop: false }))
      await openDrawer(screen)

      expect(document.querySelector('.magic-drawer__backdrop')).toBeNull()
    })
  })

  describe('tag', () => {
    it('tag: dialog uses dialog element', async () => {
      const screen = render(createWrapper(DrawerId.TagDialog, { tag: 'dialog' }))
      await openDrawer(screen)

      const drag = document.querySelector('.magic-drawer__drag')
      expect(drag!.tagName.toLowerCase()).toBe('dialog')
    })

    it('tag: div uses div element', async () => {
      const screen = render(createWrapper(DrawerId.TagDiv, { tag: 'div' }))
      await openDrawer(screen)

      const drag = document.querySelector('.magic-drawer__drag')
      expect(drag!.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('teleport', () => {
    it('teleport.disabled prevents teleportation', async () => {
      const screen = render(
        createWrapper(DrawerId.TeleportDisabled, {
          teleport: { target: 'body', disabled: true },
        })
      )
      await openDrawer(screen)

      const directChild = document.body.querySelector(':scope > .magic-drawer')
      const drawer = document.querySelector('.magic-drawer')
      expect(drawer).not.toBeNull()
      expect(directChild).toBeNull()
    })

    it('teleport to custom target', async () => {
      const target = document.createElement('div')
      target.id = 'custom-target'
      document.body.appendChild(target)

      const screen = render(
        createWrapper(DrawerId.TeleportCustom, {
          teleport: { target: '#custom-target' },
        })
      )
      await openDrawer(screen)

      const drawerInTarget = target.querySelector('.magic-drawer')
      expect(drawerInTarget).not.toBeNull()

      document.body.removeChild(target)
    })
  })

  describe('disabled', () => {
    it('disabled: true sets data-disabled to true', async () => {
      const screen = render(createWrapper(DrawerId.DisabledTrue, { disabled: true }))
      await openDrawer(screen)

      const drawer = document.querySelector('.magic-drawer')
      expect(drawer!.getAttribute('data-disabled')).toBe('true')
    })

    it('disabled: false sets data-disabled to false', async () => {
      const screen = render(createWrapper(DrawerId.DisabledFalse, { disabled: false }))
      await openDrawer(screen)

      const drawer = document.querySelector('.magic-drawer')
      expect(drawer!.getAttribute('data-disabled')).toBe('false')
    })
  })

  describe('snapPoints', () => {
    it('renders with percentage snap points', async () => {
      const screen = render(
        createWrapper(DrawerId.SnapPercent, { snapPoints: [0.5, 1] })
      )
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('renders with pixel snap points', async () => {
      const screen = render(
        createWrapper(DrawerId.SnapPx, { snapPoints: ['200px', '400px'] })
      )
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('renders with mixed snap points', async () => {
      const screen = render(
        createWrapper(DrawerId.SnapMixed, { snapPoints: ['320px', 0.75, 1] })
      )
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('scrollLock', () => {
    it('scrollLock: true — drawer opens successfully', async () => {
      const screen = render(
        createWrapper(DrawerId.ScrollLock, { scrollLock: true })
      )
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('scrollLock: false does not lock document scroll', async () => {
      const screen = render(
        createWrapper(DrawerId.NoScrollLock, { scrollLock: false })
      )
      await openDrawer(screen)
      await new Promise((r) => setTimeout(r, 400))

      expect(document.documentElement.style.overflow).not.toBe('hidden')
    })
  })

  describe('transition', () => {
    it('custom content transition name — drawer opens successfully', async () => {
      const screen = render(
        createWrapper(DrawerId.CustomTransition, {
          transition: {
            content: 'custom-content-transition',
            backdrop: 'custom-backdrop-transition',
          },
        })
      )
      await openDrawer(screen)

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('initial', () => {
    it('initial.open: true opens on mount', async () => {
      render(createWrapper(DrawerId.InitialOpen, { initial: { open: true } }))
      await nextTick()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('initial.open: false does not open on mount', () => {
      render(createWrapper(DrawerId.InitialClosed, { initial: { open: false } }))

      expect(document.querySelector('.magic-drawer')).toBeNull()
    })

    it('initial.transition: false suppresses mount animation', async () => {
      render(
        createWrapper(DrawerId.InitialNoAnim, {
          initial: { open: true, transition: false },
        })
      )
      await nextTick()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('enableMousewheel', () => {
    it('enableMousewheel: false — data-wheeling is false', async () => {
      const screen = render(
        createWrapper(DrawerId.NoWheel, { enableMousewheel: false })
      )
      await openDrawer(screen)

      const drawer = document.querySelector('.magic-drawer')
      expect(drawer!.getAttribute('data-wheeling')).toBe('false')
    })
  })
})
