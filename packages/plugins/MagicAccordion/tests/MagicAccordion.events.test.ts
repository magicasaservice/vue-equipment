import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { AccordionId, ViewId, TestId } from './enums'

// ─── Factory ──────────────────────────────────────────────────────────────────

function createEventWrapper(accordionId: AccordionId) {
  return defineComponent({
    components: {
      MagicAccordionProvider,
      MagicAccordionView,
      MagicAccordionTrigger,
      MagicAccordionContent,
    },
    setup() {
      const api = useMagicAccordion(accordionId)
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])
      const lastPayload = reactive<Record<string, unknown>>({})

      emitter.on('beforeEnter', (payload: unknown) => {
        events.push('beforeEnter')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })
      emitter.on('enter', (payload: unknown) => {
        events.push('enter')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })
      emitter.on('afterEnter', (payload: unknown) => {
        events.push('afterEnter')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })
      emitter.on('beforeLeave', (payload: unknown) => {
        events.push('beforeLeave')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })
      emitter.on('leave', (payload: unknown) => {
        events.push('leave')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })
      emitter.on('afterLeave', (payload: unknown) => {
        events.push('afterLeave')
        Object.assign(lastPayload, payload as Record<string, unknown>)
      })

      return { ...api, events, lastPayload }
    },
    template: `
      <div>
        <button data-test-id="${TestId.Open}" @click="selectView('${ViewId.EvView}')">Open</button>
        <button data-test-id="${TestId.Close}" @click="unselectView('${ViewId.EvView}')">Close</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.PayloadId}">{{ lastPayload.id }}</span>
        <span data-test-id="${TestId.PayloadView}">{{ lastPayload.viewId }}</span>
        <MagicAccordionProvider id="${accordionId}">
          <MagicAccordionView id="${ViewId.EvView}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div>Content</div>
              </MagicAccordionContent>
              <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
        </MagicAccordionProvider>
      </div>
    `,
  })
}

function getTestText(container: HTMLElement, id: TestId): string {
  return (
    container.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - Events', () => {
  describe('enter events', () => {
    it('fires beforeEnter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.BeforeEnter)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.Events)).toContain('beforeEnter')
      } finally {
        unmount()
      }
    })

    it('fires enter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.Enter)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.Events)).toContain('enter')
      } finally {
        unmount()
      }
    })

    it('fires afterEnter after transition completes', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.AfterEnter)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()
        // Wait for Vue transition (200ms default + buffer)
        await new Promise((r) => setTimeout(r, 400))

        expect(getTestText(container, TestId.Events)).toContain('afterEnter')
      } finally {
        unmount()
      }
    })

    it('enter events fire in correct order: beforeEnter → enter → afterEnter', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.EnterOrder)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const eventsText = getTestText(container, TestId.Events)
        const events = eventsText.split(',').filter(Boolean)

        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
        expect(events).toContain('afterEnter')

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

  describe('leave events', () => {
    it('fires beforeLeave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.BeforeLeave)
      )

      try {
        const openBtn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const closeBtn = container.querySelector(
          `[data-test-id="${TestId.Close}"]`
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.Events)).toContain('beforeLeave')
      } finally {
        unmount()
      }
    })

    it('fires leave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.Leave)
      )

      try {
        const openBtn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const closeBtn = container.querySelector(
          `[data-test-id="${TestId.Close}"]`
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.Events)).toContain('leave')
      } finally {
        unmount()
      }
    })

    it('fires afterLeave after close transition completes', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.AfterLeave)
      )

      try {
        const openBtn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const closeBtn = container.querySelector(
          `[data-test-id="${TestId.Close}"]`
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        expect(getTestText(container, TestId.Events)).toContain('afterLeave')
      } finally {
        unmount()
      }
    })

    it('leave events fire in correct order: beforeLeave → leave → afterLeave', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.LeaveOrder)
      )

      try {
        const openBtn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const closeBtn = container.querySelector(
          `[data-test-id="${TestId.Close}"]`
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 400))

        const eventsText = getTestText(container, TestId.Events)
        const events = eventsText.split(',').filter(Boolean)

        // Only assert leave events (after the enter events)
        expect(events).toContain('beforeLeave')
        expect(events).toContain('leave')
        expect(events).toContain('afterLeave')

        const beforeIdx = events.lastIndexOf('beforeLeave')
        const leaveIdx = events.lastIndexOf('leave')
        const afterIdx = events.lastIndexOf('afterLeave')

        expect(beforeIdx).toBeGreaterThanOrEqual(0)
        expect(beforeIdx).toBeLessThan(leaveIdx)
        expect(leaveIdx).toBeLessThan(afterIdx)
      } finally {
        unmount()
      }
    })
  })

  describe('event payload', () => {
    it('enter event payload includes accordion id', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.PayloadId)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.PayloadId)).toBe(
          AccordionId.PayloadId
        )
      } finally {
        unmount()
      }
    })

    it('enter event payload includes viewId', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(AccordionId.PayloadView)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.Open}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, TestId.PayloadView)).toBe(ViewId.EvView)
      } finally {
        unmount()
      }
    })
  })
})
