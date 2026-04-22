import { describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { MagicModal } from '../index'
import { useMagicModal } from '../src/composables/useMagicModal'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { ModalId, TestId } from './enums'

// ─── Factory ──────────────────────────────────────────────────────────────────

function createEventTrackingWrapper(
  modalId: ModalId,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicModal },
    setup() {
      const { open, close, isActive } = useMagicModal(modalId)
      const emitter = useMagicEmitter()

      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('beforeEnter', (data: unknown) => {
        events.push('beforeEnter')
        lastPayload.value = data
      })
      emitter.on('enter', () => events.push('enter'))
      emitter.on('afterEnter', () => events.push('afterEnter'))
      emitter.on('beforeLeave', () => events.push('beforeLeave'))
      emitter.on('leave', () => events.push('leave'))
      emitter.on('afterLeave', () => events.push('afterLeave'))

      function clearEvents() {
        events.length = 0
        lastPayload.value = null
      }

      return {
        open,
        close,
        isActive,
        events,
        lastPayload,
        clearEvents,
      }
    },
    template: `
      <div>
        <button data-test-id="${TestId.OpenBtn}" @click="open">Open</button>
        <button data-test-id="${TestId.CloseBtn}" @click="close">Close</button>
        <button data-test-id="${TestId.ClearEvents}" @click="clearEvents">Clear</button>
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.LastPayload}">{{ JSON.stringify(lastPayload) }}</span>
        <MagicModal id="${modalId}" :options="options">
          <div data-test-id="${TestId.ModalContent}" style="height: 200px; width: 100%;">
            <button>Focusable</button>
          </div>
        </MagicModal>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

async function openModal(container: HTMLElement) {
  const btn = container.querySelector(
    `[data-test-id="${TestId.OpenBtn}"]`
  ) as HTMLElement
  btn.click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 600))
}

function getTestText(id: TestId): string {
  return (
    document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicModal - Events', () => {
  describe('transition lifecycle events', () => {
    it('emits beforeEnter, enter, afterEnter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper(ModalId.EventOpen)
      )

      try {
        await openModal(container)

        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
        expect(events).toContain('afterEnter')
      } finally {
        unmount()
      }
    })

    it('emits beforeLeave, leave, afterLeave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper(ModalId.EventClose)
      )

      try {
        await openModal(container)

        // Clear events
        const clearBtn = container.querySelector(
          `[data-test-id="${TestId.ClearEvents}"]`
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        // Close via Escape
        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeLeave')
        expect(events).toContain('leave')
        expect(events).toContain('afterLeave')
      } finally {
        unmount()
      }
    })

    it('enter events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper(ModalId.EventOrder)
      )

      try {
        await openModal(container)

        const text = getTestText(TestId.Events)
        const events = text.split(',')

        const beforeIdx = events.indexOf('beforeEnter')
        const enterIdx = events.indexOf('enter')
        const afterIdx = events.indexOf('afterEnter')

        expect(beforeIdx).toBeGreaterThanOrEqual(0)
        expect(beforeIdx).toBeLessThan(enterIdx)
        expect(enterIdx).toBeLessThan(afterIdx)
      } finally {
        unmount()
      }
    })

    it('leave events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper(ModalId.EventLeaveOrder)
      )

      try {
        await openModal(container)

        const clearBtn = container.querySelector(
          `[data-test-id="${TestId.ClearEvents}"]`
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const text = getTestText(TestId.Events)
        const events = text.split(',')

        const beforeIdx = events.indexOf('beforeLeave')
        const leaveIdx = events.indexOf('leave')
        const afterIdx = events.indexOf('afterLeave')

        expect(beforeIdx).toBeGreaterThanOrEqual(0)
        expect(beforeIdx).toBeLessThan(leaveIdx)
        expect(leaveIdx).toBeLessThan(afterIdx)
      } finally {
        unmount()
      }
    })

    it('enter events include modal id as payload', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper(ModalId.EventPayload)
      )

      try {
        await openModal(container)

        const payloadRaw = getTestText(TestId.LastPayload)
        const payload = JSON.parse(payloadRaw)
        expect(payload.id).toBe(ModalId.EventPayload)
      } finally {
        unmount()
      }
    })
  })
})
