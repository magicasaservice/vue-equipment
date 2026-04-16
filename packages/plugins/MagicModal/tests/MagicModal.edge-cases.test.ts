import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'

function createWrapper(
  modalId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal(modalId)
      return { open, close, isActive }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <button data-test-id="close-btn" @click="close">Close</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="modal-content" style="height: 200px; width: 100%;">Content</div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createRapidWrapper(modalId: string) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal(modalId)

      function rapidToggle() {
        open()
        close()
        open()
        close()
        open() // final state: open
      }

      function doubleOpen() {
        open()
        open()
      }

      function doubleClose() {
        close()
        close()
      }

      return {
        open,
        close,
        isActive,
        rapidToggle,
        doubleOpen,
        doubleClose,
      }
    },
    template: `
      <div>
        <button data-test-id="open-btn" @click="open">Open</button>
        <button data-test-id="close-btn" @click="close">Close</button>
        <button data-test-id="rapid-btn" @click="rapidToggle">Rapid</button>
        <button data-test-id="double-open-btn" @click="doubleOpen">DblOpen</button>
        <button data-test-id="double-close-btn" @click="doubleClose">DblClose</button>
        <span data-test-id="is-active">{{ isActive }}</span>
        <MagicModal id="${modalId}">
          <div>Content</div>
        </MagicModal>
      </div>
    `,
  })
}

describe('MagicModal - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createWrapper('default-modal'))
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      expect(document.querySelector('.magic-modal')).not.toBeNull()

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })
  })

  describe('rapid state changes', () => {
    it('rapid open/close does not break state', async () => {
      const screen = render(createRapidWrapper('rapid-modal'))

      await screen.getByTestId('rapid-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidWrapper('double-open-modal'))

      await screen.getByTestId('double-open-btn').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidWrapper('double-close-modal'))

      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      // Double close via DOM click (button behind modal)
      const dblCloseBtn = document.querySelector(
        '[data-test-id="double-close-btn"]'
      ) as HTMLElement
      dblCloseBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('false')

      // Should still be openable via DOM click (modal may still overlay)
      const openBtn = document.querySelector(
        '[data-test-id="open-btn"]'
      ) as HTMLElement
      openBtn.click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('is-active'))
        .toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting removes modal DOM elements', async () => {
      const container = defineComponent({
        components: { MagicModal },
        setup() {
          const { open, close, isActive } = useMagicModal('unmount-modal')
          return { open, close, isActive }
        },
        data() {
          return { showModal: true }
        },
        template: `
          <div>
            <button data-test-id="open-btn" @click="open">Open</button>
            <button data-test-id="toggle-btn" @click="showModal = !showModal">Toggle</button>
            <span data-test-id="is-active">{{ isActive }}</span>
            <MagicModal v-if="showModal" id="unmount-modal">
              <div>Content</div>
            </MagicModal>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-modal')).not.toBeNull()

      // Toggle button is behind modal, use DOM click
      const toggleBtn = document.querySelector(
        '[data-test-id="toggle-btn"]'
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      // Modal DOM should be removed after unmount
      expect(document.querySelector('.magic-modal')).toBeNull()
    })

    it('unmounting cleans up scroll lock', async () => {
      const container = defineComponent({
        components: { MagicModal },
        setup() {
          const { open, isActive } = useMagicModal('cleanup-scroll-modal')
          return { open, isActive }
        },
        data() {
          return { showModal: true }
        },
        template: `
          <div>
            <button data-test-id="open-btn" @click="open">Open</button>
            <button data-test-id="toggle-btn" @click="showModal = !showModal">Toggle</button>
            <MagicModal
              v-if="showModal"
              id="cleanup-scroll-modal"
              :options="{ scrollLock: true }"
            >
              <div>Content</div>
            </MagicModal>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId('open-btn').click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      // Unmount via DOM click
      const toggleBtn = document.querySelector(
        '[data-test-id="toggle-btn"]'
      ) as HTMLElement
      toggleBtn.click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const htmlOverflow = document.documentElement.style.overflow
      expect(htmlOverflow).not.toBe('hidden')
    })
  })

  describe('concurrent modal instances', () => {
    it('opening multiple modals simultaneously works', async () => {
      const wrapper = defineComponent({
        components: { MagicModal },
        setup() {
          const m1 = useMagicModal('concurrent-m1')
          const m2 = useMagicModal('concurrent-m2')
          const m3 = useMagicModal('concurrent-m3')
          return {
            openAll: () => {
              m1.open()
              m2.open()
              m3.open()
            },
            isActive1: m1.isActive,
            isActive2: m2.isActive,
            isActive3: m3.isActive,
          }
        },
        template: `
          <div>
            <button data-test-id="open-all" @click="openAll">Open All</button>
            <span data-test-id="active-1">{{ isActive1 }}</span>
            <span data-test-id="active-2">{{ isActive2 }}</span>
            <span data-test-id="active-3">{{ isActive3 }}</span>
            <MagicModal id="concurrent-m1"><div>1</div></MagicModal>
            <MagicModal id="concurrent-m2"><div>2</div></MagicModal>
            <MagicModal id="concurrent-m3"><div>3</div></MagicModal>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('open-all').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-3'))
        .toHaveTextContent('true')
    })
  })
})
