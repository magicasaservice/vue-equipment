import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import MagicToastProvider from '../src/components/MagicToastProvider.vue'
import { useMagicToast } from '../src/composables/useMagicToast'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { ToastId, TestId } from './enums'

const SimpleToast = defineComponent({
  template: '<div class="toast-content" style="height: 50px;">Toast</div>',
})

function createEventWrapper(toastId: ToastId) {
  return defineComponent({
    components: { MagicToastProvider },
    setup() {
      const api = useMagicToast(toastId)
      const emitter = useMagicEmitter()

      const events = reactive<string[]>([])

      emitter.on('beforeEnter', () => events.push('beforeEnter'))
      emitter.on('enter', () => events.push('enter'))
      emitter.on('afterEnter', () => events.push('afterEnter'))
      emitter.on('beforeLeave', () => events.push('beforeLeave'))
      emitter.on('leave', () => events.push('leave'))
      emitter.on('afterLeave', () => events.push('afterLeave'))

      function addToast() {
        api.add({ component: SimpleToast })
      }

      function clearEvents() {
        events.length = 0
      }

      return { ...api, addToast, events, clearEvents }
    },
    template: `
      <div>
        <button data-test-id="${TestId.AddBtn}" @click="addToast">Add</button>
        <button data-test-id="${TestId.ClearBtn}" @click="clear()">Clear</button>
        <button data-test-id="${TestId.ClearEvents}" @click="clearEvents">Clear Events</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.Count}">{{ count }}</span>
        <MagicToastProvider id="${toastId}" />
      </div>
    `,
  })
}

function getTestText(id: TestId): string {
  return (
    document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
  )
}

describe('MagicToast - Events', () => {
  describe('enter transition events', () => {
    it('emits beforeEnter and enter on add', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(ToastId.EventEnter)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.AddBtn}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
      } finally {
        unmount()
      }
    })

    it('emits afterEnter after transition completes', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(ToastId.EventAfterEnter)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.AddBtn}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const events = getTestText(TestId.Events)
        expect(events).toContain('afterEnter')
      } finally {
        unmount()
      }
    })
  })

  describe('leave transition events', () => {
    it('emits leave events on clear', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(ToastId.EventLeave)
      )

      try {
        // Add toast
        const addBtn = container.querySelector(
          `[data-test-id="${TestId.AddBtn}"]`
        ) as HTMLElement
        addBtn.click()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        // Clear events
        const clearEventsBtn = container.querySelector(
          `[data-test-id="${TestId.ClearEvents}"]`
        ) as HTMLElement
        clearEventsBtn.click()
        await nextTick()

        // Clear toasts
        const clearBtn = container.querySelector(
          `[data-test-id="${TestId.ClearBtn}"]`
        ) as HTMLElement
        clearBtn.click()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeLeave')
        expect(events).toContain('leave')
      } finally {
        unmount()
      }
    })
  })

  describe('event order', () => {
    it('enter events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(ToastId.EventOrder)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.AddBtn}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

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
  })
})
