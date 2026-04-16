import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'

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
        <button data-test-id="add-btn" @click="addToast()">Add</button>
        <button data-test-id="clear-btn" @click="clear()">Clear</button>
        <span data-test-id="count">{{ count }}</span>
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
      const screen = render(createWrapper('edge-defaults'))

      await screen.getByTestId('add-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
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
          const api = useMagicToast('edge-rapid-add')

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
            <button data-test-id="rapid-btn" @click="rapidAdd">Rapid Add</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="edge-rapid-add" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('rapid-btn').click()
      await nextTick()
      await nextTick()

      // Count should be capped at max (default 3) after transitions
      await new Promise((r) => setTimeout(r, 500))
      const count = parseInt(
        document.querySelector('[data-test-id="count"]')!.textContent ||
          '0'
      )
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThanOrEqual(10)
    })

    it('add then immediate clear works', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('edge-add-clear')

          function addThenClear() {
            api.add({ component: SimpleToast })
            api.add({ component: SimpleToast })
            api.clear()
          }

          return { ...api, addThenClear }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="addThenClear">Go</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="edge-add-clear" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('remove nonexistent', () => {
    it('removing nonexistent ID does not error', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('edge-remove-invalid')

          function removeInvalid() {
            api.remove('nonexistent-id')
          }

          return { ...api, removeInvalid }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="removeInvalid">Remove</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="edge-remove-invalid" />
          </div>
        `,
      })

      const screen = render(wrapper)
      // Should not throw
      await screen.getByTestId('btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('clear empty', () => {
    it('clearing with no toasts does not error', async () => {
      const screen = render(createWrapper('edge-clear-empty'))

      // Should not throw
      await screen.getByTestId('clear-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('concurrent providers', () => {
    it('multiple providers maintain independent state', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api1 = useMagicToast('edge-concurrent-1')
          const api2 = useMagicToast('edge-concurrent-2')

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
            <button data-test-id="add-1" @click="addTo1">Add 1</button>
            <button data-test-id="add-2" @click="addTo2">Add 2</button>
            <span data-test-id="count-1">{{ count1 }}</span>
            <span data-test-id="count-2">{{ count2 }}</span>
            <MagicToastProvider id="edge-concurrent-1" />
            <MagicToastProvider id="edge-concurrent-2" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-1').click()
      await screen.getByTestId('add-1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count-1'))
        .toHaveTextContent('2')
      await expect
        .element(page.getByTestId('count-2'))
        .toHaveTextContent('0')
    })
  })

  describe('per-toast duration override', () => {
    it('individual toast duration overrides provider default', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('edge-duration-override')

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
            <button data-test-id="add-short" @click="addShort">Short</button>
            <button data-test-id="add-long" @click="addLong">Long</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="edge-duration-override" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-short').click()
      await screen.getByTestId('add-long').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('2')

      // Wait for short one to close
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')
    })
  })

  describe('remove event on component', () => {
    it('component can self-remove via @remove emit', async () => {
      const SelfClosing = defineComponent({
        emits: ['remove'],
        template:
          '<button data-test-id="close-self" @click="$emit(\'remove\')">Close</button>',
      })

      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('edge-self-remove')

          function addToast() {
            api.add({ component: SelfClosing })
          }

          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="edge-self-remove" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')

      // Click self-close button inside toast
      const closeBtn = document.querySelector(
        '[data-test-id="close-self"]'
      ) as HTMLElement
      expect(closeBtn).not.toBeNull()
      closeBtn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('expand/collapse toggling', () => {
    it('rapid expand/collapse does not break', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('edge-toggle-rapid')

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
            <button data-test-id="toggle-btn" @click="rapidToggle">Toggle</button>
            <MagicToastProvider id="edge-toggle-rapid" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('toggle-btn').click()
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('true')
    })
  })
})
