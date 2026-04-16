import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'

const SimpleToast = defineComponent({
  props: { message: { type: String, default: 'Toast' } },
  emits: ['remove'],
  template: '<div class="toast-content">{{ message }}</div>',
})

function createWrapper(toastId: string) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)
      let lastId = ''

      function addToast(msg?: string) {
        lastId = api.add({
          component: SimpleToast,
          props: { message: msg || 'Toast' },
        })
      }

      function addWithId(id: string) {
        api.add({ component: SimpleToast, id })
      }

      function removeLast() {
        api.remove(lastId)
      }

      return { ...api, addToast, addWithId, removeLast, lastId }
    },
    template: `
      <div>
        <button data-test-id="add-btn" @click="addToast()">Add</button>
        <button data-test-id="remove-btn" @click="removeLast">Remove</button>
        <button data-test-id="clear-btn" @click="clear()">Clear</button>
        <button data-test-id="expand-btn" @click="expand">Expand</button>
        <button data-test-id="collapse-btn" @click="collapse">Collapse</button>
        <span data-test-id="count">{{ count }}</span>
        <MagicToastProvider id="${toastId}" />
      </div>
    `,
  })
}

describe('MagicToast - API', () => {
  describe('add', () => {
    it('add() creates a toast and increments count', async () => {
      const screen = render(createWrapper('api-add'))
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')

      await screen.getByTestId('add-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')
    })

    it('add() returns toast ID', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('api-return-id')
          let returnedId = ''

          function addAndCapture() {
            returnedId = api.add({ component: SimpleToast })
          }

          return {
            ...api,
            addAndCapture,
            get returnedId() {
              return returnedId
            },
          }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addAndCapture">Add</button>
            <MagicToastProvider id="api-return-id" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()

      const views = document.querySelectorAll('.magic-toast-view')
      expect(views.length).toBe(1)
      // View should have a data-id
      expect(views[0]!.getAttribute('data-id')).toBeTruthy()
    })

    it('add() with custom ID uses that ID', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('api-custom-id')
          function addCustom() {
            api.add({ component: SimpleToast, id: 'custom-toast-123' })
          }
          return { ...api, addCustom }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addCustom">Add</button>
            <MagicToastProvider id="api-custom-id" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      const view = document.querySelector('.magic-toast-view')
      expect(view!.getAttribute('data-id')).toBe('custom-toast-123')
    })

    it('add() renders component with props', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('api-with-props')
          function addWithProps() {
            api.add({
              component: SimpleToast,
              props: { message: 'Custom Message' },
            })
          }
          return { ...api, addWithProps }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addWithProps">Add</button>
            <MagicToastProvider id="api-with-props" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()
      await nextTick()

      const content = document.querySelector('.toast-content')
      expect(content!.textContent).toBe('Custom Message')
    })

    it('multiple add() calls stack toasts', async () => {
      const screen = render(createWrapper('api-stack'))

      await screen.getByTestId('add-btn').click()
      await screen.getByTestId('add-btn').click()
      await screen.getByTestId('add-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('3')

      const views = document.querySelectorAll('.magic-toast-view')
      expect(views.length).toBe(3)
    })
  })

  describe('remove', () => {
    it('remove() deletes specific toast', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('api-remove')
          let toastId = ''

          function addAndSave() {
            toastId = api.add({ component: SimpleToast })
          }

          function removeIt() {
            api.remove(toastId)
          }

          return { ...api, addAndSave, removeIt }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addAndSave">Add</button>
            <button data-test-id="remove-btn" @click="removeIt">Remove</button>
            <span data-test-id="count">{{ count }}</span>
            <MagicToastProvider id="api-remove" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('1')

      await screen.getByTestId('remove-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('clear', () => {
    it('clear() removes all toasts', async () => {
      const screen = render(createWrapper('api-clear'))

      // Add 3 toasts
      await screen.getByTestId('add-btn').click()
      await screen.getByTestId('add-btn').click()
      await screen.getByTestId('add-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('3')

      await screen.getByTestId('clear-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })

  describe('expand and collapse', () => {
    it('expand() sets expanded state', async () => {
      const screen = render(createWrapper('api-expand'))

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('false')

      await screen.getByTestId('expand-btn').click()
      await nextTick()

      expect(provider!.getAttribute('data-expanded')).toBe('true')
    })

    it('collapse() unsets expanded state', async () => {
      const screen = render(createWrapper('api-collapse'))

      await screen.getByTestId('expand-btn').click()
      await nextTick()

      const provider = document.querySelector('.magic-toast-provider')
      expect(provider!.getAttribute('data-expanded')).toBe('true')

      await screen.getByTestId('collapse-btn').click()
      await nextTick()

      expect(provider!.getAttribute('data-expanded')).toBe('false')
    })
  })

  describe('toasts and count', () => {
    it('toasts ref tracks all active views', async () => {
      const wrapper = defineComponent({
        components: { MagicToastProvider },
        setup() {
          const api = useMagicToast('api-toasts-ref')
          function addToast() {
            api.add({ component: SimpleToast })
          }
          return { ...api, addToast }
        },
        template: `
          <div>
            <button data-test-id="add-btn" @click="addToast">Add</button>
            <span data-test-id="ids">{{ toasts.map(t => t.id).join(',') }}</span>
            <MagicToastProvider id="api-toasts-ref" />
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('add-btn').click()
      await screen.getByTestId('add-btn').click()
      await nextTick()

      const ids = document.querySelector(
        '[data-test-id="ids"]'
      )!.textContent
      // Should have 2 comma-separated IDs
      expect(ids!.split(',').length).toBe(2)
    })

    it('count is 0 when no toasts', async () => {
      render(createWrapper('api-count-zero'))
      await nextTick()

      await expect
        .element(page.getByTestId('count'))
        .toHaveTextContent('0')
    })
  })
})
