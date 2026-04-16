import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'

function createEventWrapper(accordionId: string) {
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
        <button data-test-id="open" @click="selectView('ev-view')">Open</button>
        <button data-test-id="close" @click="unselectView('ev-view')">Close</button>
        <span data-test-id="events">{{ events.join(',') }}</span>
        <span data-test-id="payload-id">{{ lastPayload.id }}</span>
        <span data-test-id="payload-view">{{ lastPayload.viewId }}</span>
        <MagicAccordionProvider id="${accordionId}">
          <MagicAccordionView id="ev-view">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div>Content</div>
              </MagicAccordionContent>
              <span data-test-id="active">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
        </MagicAccordionProvider>
      </div>
    `,
  })
}

function getTestText(container: HTMLElement, id: string): string {
  return (
    container.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
  )
}

describe('MagicAccordion - Events', () => {
  describe('enter events', () => {
    it('fires beforeEnter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-before-enter')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'events')).toContain('beforeEnter')
      } finally {
        unmount()
      }
    })

    it('fires enter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-enter')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'events')).toContain('enter')
      } finally {
        unmount()
      }
    })

    it('fires afterEnter after transition completes', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-after-enter')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()
        // Wait for transition to complete
        await new Promise((r) => setTimeout(r, 300))

        expect(getTestText(container, 'events')).toContain('afterEnter')
      } finally {
        unmount()
      }
    })

    it('enter events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-enter-order')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        const events = getTestText(container, 'events')
        const idx = {
          before: events.indexOf('beforeEnter'),
          enter: events.indexOf('enter'),
          after: events.indexOf('afterEnter'),
        }
        expect(idx.before).toBeLessThan(idx.enter)
        expect(idx.enter).toBeLessThan(idx.after)
      } finally {
        unmount()
      }
    })
  })

  describe('leave events', () => {
    it('fires beforeLeave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-before-leave')
      )

      try {
        // Open first
        const openBtn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        // Close
        const closeBtn = container.querySelector(
          '[data-test-id="close"]'
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'events')).toContain('beforeLeave')
      } finally {
        unmount()
      }
    })

    it('fires leave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-leave')
      )

      try {
        const openBtn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        const closeBtn = container.querySelector(
          '[data-test-id="close"]'
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'events')).toContain('leave')
      } finally {
        unmount()
      }
    })

    it('fires afterLeave after close transition completes', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-after-leave')
      )

      try {
        const openBtn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        const closeBtn = container.querySelector(
          '[data-test-id="close"]'
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        expect(getTestText(container, 'events')).toContain('afterLeave')
      } finally {
        unmount()
      }
    })

    it('leave events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-leave-order')
      )

      try {
        const openBtn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        openBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        const closeBtn = container.querySelector(
          '[data-test-id="close"]'
        ) as HTMLElement
        closeBtn.click()
        await nextTick()
        await nextTick()
        await new Promise((r) => setTimeout(r, 300))

        const events = getTestText(container, 'events')
        const idx = {
          before: events.indexOf('beforeLeave'),
          leave: events.indexOf('leave,'),
          after: events.indexOf('afterLeave'),
        }
        expect(idx.before).toBeLessThan(idx.leave)
        expect(idx.leave).toBeLessThan(idx.after)
      } finally {
        unmount()
      }
    })
  })

  describe('event payload', () => {
    it('enter events include accordion id', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-payload-id')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'payload-id')).toBe('evt-payload-id')
      } finally {
        unmount()
      }
    })

    it('enter events include viewId', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('evt-payload-view')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="open"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(container, 'payload-view')).toBe('ev-view')
      } finally {
        unmount()
      }
    })
  })
})
