import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'
import { ToastId, TestId } from './enums'

const SimpleToast = defineComponent({
  props: { message: { type: String, default: 'Toast' } },
  template: '<div class="toast-content">{{ message }}</div>',
})

function createWrapper(
  toastId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)
      function addToast() {
        api.add({ component: SimpleToast })
      }
      return { ...api, addToast }
    },
    template: `
      <div>
        <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
        <span data-test-id="${TestId.Count}">{{ count }}</span>
        <MagicToastProvider id="${toastId}" :options="options" />
      </div>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicToast - Options', () => {
  describe('position', () => {
    const positions = [
      'top-left',
      'top',
      'top-right',
      'left',
      'right',
      'bottom-left',
      'bottom',
      'bottom-right',
    ] as const

    positions.forEach((pos) => {
      it(`position: ${pos} sets data-position`, async () => {
        render(createWrapper(`opt-pos-${pos}`, { position: pos }))
        await nextTick()

        const provider = document.querySelector('.magic-toast-provider')
        expect(provider!.getAttribute('data-position')).toBe(pos)
      })
    })
  })

  describe('layout.max', () => {
    it('toasts can be added beyond max (max enforced during transition)', async () => {
      const screen = render(createWrapper(ToastId.OptMaxDefault))

      for (let i = 0; i < 5; i++) {
        await screen.getByTestId(TestId.AddBtn).click()
      }
      await nextTick()

      // Without real transitions, max isn't enforced — all 5 exist in state
      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('5')
    })

    it('layout.max option is accepted without error', async () => {
      const screen = render(
        createWrapper(ToastId.OptMaxCustom, { layout: { max: 2 } })
      )

      await screen.getByTestId(TestId.AddBtn).click()
      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('2')
    })
  })

  describe('initial', () => {
    it('initial.expanded: true starts expanded', async () => {
      render(
        createWrapper(ToastId.OptInitialExpanded, {
          initial: { expanded: true },
        })
      )
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('true')
    })

    it('initial.expanded defaults to false', async () => {
      render(createWrapper(ToastId.OptInitialDefault))
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')
    })
  })

  describe('debug', () => {
    it('debug: true sets data-debug on toast views', async () => {
      const screen = render(
        createWrapper(ToastId.OptDebug, { debug: true })
      )

      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-debug')).toBe('true')
    })

    it('debug defaults to false', async () => {
      const screen = render(createWrapper(ToastId.OptDebugDefault))

      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-debug')).toBe('false')
    })
  })

  describe('duration', () => {
    it('duration: 0 (default) does not auto-close', async () => {
      const screen = render(createWrapper(ToastId.OptDurationZero))

      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()

      // Wait longer than a typical duration
      await new Promise((r) => setTimeout(r, 500))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')
    })

    it('duration > 0 auto-closes toast', async () => {
      const screen = render(
        createWrapper(ToastId.OptDurationAuto, { duration: 200 })
      )

      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')

      // Wait for auto-close
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })
  })

  describe('teleport', () => {
    it('custom teleport target works', async () => {
      const target = document.createElement('div')
      target.id = 'opt-toast-target'
      document.body.appendChild(target)

      try {
        render(
          createWrapper(ToastId.OptTeleport, {
            teleport: { target: '#opt-toast-target' },
          })
        )
        await nextTick()

        const provider = target.querySelector('.magic-toast-provider')
        expect(provider).not.toBeNull()
      } finally {
        document.body.removeChild(target)
      }
    })
  })
})
