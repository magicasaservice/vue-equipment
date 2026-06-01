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
  toastId: ToastId,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)

      function addToast(msg?: string) {
        api.add({
          component: SimpleToast,
          props: { message: msg || 'Toast' },
        })
      }

      return { ...api, addToast }
    },
    template: `
      <div>
        <button data-test-id="${TestId.AddBtn}" @click="addToast()">Add</button>
        <button data-test-id="${TestId.ClearBtn}" @click="clear()">Clear</button>
        <span data-test-id="${TestId.Count}">{{ count }}</span>
        <MagicToastProvider id="${toastId}" :options="options" />
      </div>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicToast - Edge Cases', () => {
  describe('zero configuration', () => {
    it('works with no options (all defaults)', async () => {
      const screen = render(createWrapper(ToastId.EdgeDefaults))

      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')

      expect(
        document.querySelector('.magic-toast-provider')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-toast-view')
      ).not.toBeNull()
    })
  })

  describe('rapid operations', () => {
    it('rapid add does not break state', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeRapidAdd)

          function rapidAdd() {
            for (let i = 0; i < 10; i++) {
              api.add({
                component: SimpleToast,
                props: { message: `Toast ${i}` },
              })
            }
          }

          return { ...api, rapidAdd }
        },
        template: `
          <div>
            <button data-test-id="${TestId.RapidBtn}" @click="rapidAdd">Rapid Add</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.EdgeRapidAdd}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.RapidBtn).click()
      await nextTick()
      await nextTick()

      // Count should be capped at max (default 3) after transitions
      await new Promise((r) => setTimeout(r, 500))
      const count = parseInt(
        document.querySelector(`[data-test-id="${TestId.Count}"]`)!.textContent ||
          '0'
      )
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThanOrEqual(10)
    })

    it('add then immediate clear works', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeAddClear)

          function addThenClear() {
            api.add({ component: SimpleToast })
            api.add({ component: SimpleToast })
            api.clear()
          }

          return { ...api, addThenClear }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Btn}" @click="addThenClear">Go</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.EdgeAddClear}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Btn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })
  })

  describe('remove nonexistent', () => {
    it('removing nonexistent ID does not error', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeRemoveInvalid)

          function removeInvalid() {
            api.remove('nonexistent-id')
          }

          return { ...api, removeInvalid }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Btn}" @click="removeInvalid">Remove</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.EdgeRemoveInvalid}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      // Should not throw
      await screen.getByTestId(TestId.Btn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })
  })

  describe('clear empty', () => {
    it('clearing with no toasts does not error', async () => {
      const screen = render(createWrapper(ToastId.EdgeClearEmpty))

      // Should not throw
      await screen.getByTestId(TestId.ClearBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })
  })

  describe('concurrent providers', () => {
    it('multiple providers maintain independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api1 = useMagicToast(ToastId.EdgeConcurrent1)
          const api2 = useMagicToast(ToastId.EdgeConcurrent2)

          function addTo1() {
            api1.add({ component: SimpleToast })
          }

          function addTo2() {
            api2.add({ component: SimpleToast })
          }

          return {
            count1: api1.count,
            count2: api2.count,
            addTo1,
            addTo2,
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Add1}" @click="addTo1">Add 1</button>
            <button data-test-id="${TestId.Add2}" @click="addTo2">Add 2</button>
            <span data-test-id="${TestId.Count1}">{{ count1 }}</span>
            <span data-test-id="${TestId.Count2}">{{ count2 }}</span>
            <MagicToastProvider id="${ToastId.EdgeConcurrent1}" />
            <MagicToastProvider id="${ToastId.EdgeConcurrent2}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.Add1).click()
      await screen.getByTestId(TestId.Add1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count1))
        .toHaveTextContent('2')
      await expect
        .element(page.getByTestId(TestId.Count2))
        .toHaveTextContent('0')
    })
  })

  describe('per-toast duration override', () => {
    it('individual toast duration overrides provider default', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeDurationOverride)

          function addShort() {
            api.add({ component: SimpleToast, duration: 200 })
          }

          function addLong() {
            api.add({ component: SimpleToast, duration: 5000 })
          }

          return { ...api, addShort, addLong }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddShort}" @click="addShort">Short</button>
            <button data-test-id="${TestId.AddLong}" @click="addLong">Long</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.EdgeDurationOverride}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.AddShort).click()
      await screen.getByTestId(TestId.AddLong).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('2')

      // Wait for short one to close
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')
    })
  })

  describe('remove event on component', () => {
    it('component can self-remove via @remove emit', async () => {
      const SelfClosing = defineComponent({
        emits: ['remove'],
        template:
          `<button data-test-id="${TestId.CloseSelf}" @click="$emit('remove')">Close</button>`,
      })

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeSelfRemove)

          function addToast() {
            api.add({ component: SelfClosing })
          }

          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
            <span data-test-id="${TestId.Count}">{{ count }}</span>
            <MagicToastProvider id="${ToastId.EdgeSelfRemove}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.AddBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('1')

      // Click self-close button inside toast
      const closeBtn = document.querySelector(
        `[data-test-id="${TestId.CloseSelf}"]`
      ) as HTMLElement
      expect(closeBtn).not.toBeNull()
      closeBtn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Count))
        .toHaveTextContent('0')
    })
  })

  describe('expand/collapse toggling', () => {
    it('rapid expand/collapse does not break', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast(ToastId.EdgeToggleRapid)

          function rapidToggle() {
            api.expand()
            api.collapse()
            api.expand()
            api.collapse()
            api.expand() // final: expanded
          }

          return { ...api, rapidToggle }
        },
        template: `
          <div>
            <button data-test-id="${TestId.ToggleBtn}" @click="rapidToggle">Toggle</button>
            <MagicToastProvider id="${ToastId.EdgeToggleRapid}" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.ToggleBtn).click()
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('true')
    })
  })
})
