import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'
import { ModalId, TestId } from './enums'

// ─── Factories ────────────────────────────────────────────────────────────────

function createWrapper(
  modalId: ModalId,
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
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="${TestId.ModalContent}" style="height: 200px; width: 100%;">Content</div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

function createRapidWrapper(modalId: ModalId) {
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
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <button data-test-id="${TestId.RapidBtn}" @click="rapidToggle">Rapid</button>
        <button data-test-id="${TestId.DoubleOpenBtn}" @click="doubleOpen">DblOpen</button>
        <button data-test-id="${TestId.DoubleCloseBtn}" @click="doubleClose">DblClose</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <MagicModal id="${modalId}">
          <div>Content</div>
        </MagicModal>
      </div>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicModal - Edge Cases', () => {
  describe('default configuration', () => {
    it('works with zero options (all defaults)', async () => {
      const screen = render(createWrapper(ModalId.Default))
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      expect(document.querySelector('.magic-modal')).not.toBeNull()

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })
  })

  describe('rapid state changes', () => {
    it('rapid open/close does not break state', async () => {
      const screen = render(createRapidWrapper(ModalId.Rapid))

      await screen.getByTestId(TestId.RapidBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })

    it('double open does not break state', async () => {
      const screen = render(createRapidWrapper(ModalId.DoubleOpen))

      await screen.getByTestId(TestId.DoubleOpenBtn).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')

      await userEvent.keyboard('{Escape}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')
    })

    it('double close does not break state', async () => {
      const screen = render(createRapidWrapper(ModalId.DoubleClose))

      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      // Double close via DOM click (button behind modal)
      const dblCloseBtn = document.querySelector(
        `[data-test-id="${TestId.DoubleCloseBtn}"]`
      ) as HTMLElement
      dblCloseBtn.click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('false')

      // Should still be openable via DOM click (modal may still overlay)
      const openBtn = document.querySelector(
        `[data-test-id="${TestId.OpenBtn}"]`
      ) as HTMLElement
      openBtn.click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsActive))
        .toHaveTextContent('true')
    })
  })

  describe('cleanup on unmount', () => {
    it('unmounting removes modal DOM elements', async () => {
      const container = defineComponent({
        components: { MagicModal },
        setup() {
          const { open, close, isActive } = useMagicModal(ModalId.Unmount)
          return { open, close, isActive }
        },
        data() {
          return { showModal: true }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="showModal = !showModal">Toggle</button>
            <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
            <MagicModal v-if="showModal" id="${ModalId.Unmount}">
              <div>Content</div>
            </MagicModal>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()

      expect(document.querySelector('.magic-modal')).not.toBeNull()

      // Toggle button is behind modal, use DOM click
      const toggleBtn = document.querySelector(
        `[data-test-id="${TestId.ToggleBtn}"]`
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
          const { open, isActive } = useMagicModal(ModalId.CleanupScroll)
          return { open, isActive }
        },
        data() {
          return { showModal: true }
        },
        template: `
          <div>
            <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
            <button data-test-id="${TestId.ToggleBtn}" @click="showModal = !showModal">Toggle</button>
            <MagicModal
              v-if="showModal"
              id="${ModalId.CleanupScroll}"
              :options="{ scrollLock: true }"
            >
              <div>Content</div>
            </MagicModal>
          </div>
        `,
      })

      const screen = render(container)
      await screen.getByTestId(TestId.OpenBtn).click()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      // Unmount via DOM click
      const toggleBtn = document.querySelector(
        `[data-test-id="${TestId.ToggleBtn}"]`
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
          const m1 = useMagicModal(ModalId.Concurrent1)
          const m2 = useMagicModal(ModalId.Concurrent2)
          const m3 = useMagicModal(ModalId.Concurrent3)
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
            <button data-test-id="${TestId.OpenAll}" @click="openAll">Open All</button>
            <span data-test-id="${TestId.Active1}">{{ isActive1 }}</span>
            <span data-test-id="${TestId.Active2}">{{ isActive2 }}</span>
            <span data-test-id="${TestId.Active3}">{{ isActive3 }}</span>
            <MagicModal id="${ModalId.Concurrent1}"><div>1</div></MagicModal>
            <MagicModal id="${ModalId.Concurrent2}"><div>2</div></MagicModal>
            <MagicModal id="${ModalId.Concurrent3}"><div>3</div></MagicModal>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId(TestId.OpenAll).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active3))
        .toHaveTextContent('true')
    })
  })
})
