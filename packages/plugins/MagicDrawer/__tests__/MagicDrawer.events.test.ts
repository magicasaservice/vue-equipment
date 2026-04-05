import { describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { MagicDrawer } from '../index'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { mountWithApp } from './test-utils'

function createEventTrackingWrapper(
  drawerId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDrawer },
    setup() {
      const { open, close, isActive, snapTo } = useMagicDrawer(drawerId)
      const emitter = useMagicEmitter()

      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('beforeEnter', (data) => {
        events.push('beforeEnter')
        lastPayload.value = data
      })
      emitter.on('enter', () => events.push('enter'))
      emitter.on('afterEnter', () => events.push('afterEnter'))
      emitter.on('beforeLeave', () => events.push('beforeLeave'))
      emitter.on('leave', () => events.push('leave'))
      emitter.on('afterLeave', () => events.push('afterLeave'))
      emitter.on('beforeDrag', (data) => {
        events.push('beforeDrag')
        lastPayload.value = data
      })
      emitter.on('drag', () => events.push('drag'))
      emitter.on('afterDrag', () => events.push('afterDrag'))
      emitter.on('snapTo', (data) => {
        events.push('snapTo')
        lastPayload.value = data
      })
      emitter.on('beforeSnap', () => events.push('beforeSnap'))
      emitter.on('afterSnap', () => events.push('afterSnap'))

      function clearEvents() {
        events.length = 0
        lastPayload.value = null
      }

      return {
        open,
        close,
        isActive,
        snapTo,
        events,
        lastPayload,
        clearEvents,
      }
    },
    template: `
      <div>
        <button data-testid="open-btn" @click="open">Open</button>
        <button data-testid="close-btn" @click="close">Close</button>
        <button data-testid="clear-events" @click="clearEvents">Clear</button>
        <span data-testid="is-active">{{ isActive }}</span>
        <span data-testid="events">{{ events.join(',') }}</span>
        <span data-testid="last-payload">{{ JSON.stringify(lastPayload) }}</span>
        <MagicDrawer id="${drawerId}" :options="options">
          <div data-testid="drawer-content" style="height: 200px; width: 100%;">
            <button>Focusable</button>
          </div>
        </MagicDrawer>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

async function openDrawer(container: HTMLElement) {
  const btn = container.querySelector('[data-testid="open-btn"]') as HTMLElement
  btn.click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 600))
}

function getTestText(id: string): string {
  return document.querySelector(`[data-testid="${id}"]`)?.textContent || ''
}

describe('MagicDrawer - Events', () => {
  describe('transition lifecycle events', () => {
    it('emits beforeEnter, enter, afterEnter on open', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-open')
      )

      try {
        await openDrawer(container)

        const events = getTestText('events')
        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
        expect(events).toContain('afterEnter')
      } finally {
        unmount()
      }
    })

    it('emits beforeLeave, leave, afterLeave on close', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-close')
      )

      try {
        await openDrawer(container)

        // Clear events
        const clearBtn = container.querySelector(
          '[data-testid="clear-events"]'
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        // Close via Escape
        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const events = getTestText('events')
        expect(events).toContain('beforeLeave')
        expect(events).toContain('leave')
        expect(events).toContain('afterLeave')
      } finally {
        unmount()
      }
    })

    it('enter events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-order')
      )

      try {
        await openDrawer(container)

        const text = getTestText('events')
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
        createEventTrackingWrapper('event-leave-order')
      )

      try {
        await openDrawer(container)

        const clearBtn = container.querySelector(
          '[data-testid="clear-events"]'
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const text = getTestText('events')
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

    it('enter events include drawer id as payload', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-payload')
      )

      try {
        await openDrawer(container)

        const payload = getTestText('last-payload')
        expect(payload).toContain('event-payload')
      } finally {
        unmount()
      }
    })
  })

  describe('drag events', () => {
    it('emits beforeDrag on pointerdown', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-drag')
      )

      try {
        await openDrawer(container)

        const clearBtn = container.querySelector(
          '[data-testid="clear-events"]'
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        const dragEl = document.querySelector(
          '.magic-drawer__drag'
        ) as HTMLElement

        if (dragEl) {
          dragEl.dispatchEvent(
            new PointerEvent('pointerdown', {
              clientX: 200,
              clientY: 300,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )

          await nextTick()
          await new Promise((r) => setTimeout(r, 100))

          const events = getTestText('events')
          expect(events).toContain('beforeDrag')

          // Cleanup
          document.dispatchEvent(
            new PointerEvent('pointerup', {
              clientX: 200,
              clientY: 300,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )
        }
      } finally {
        unmount()
      }
    })

    it('drag event payload includes id', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-drag-payload')
      )

      try {
        await openDrawer(container)

        const clearBtn = container.querySelector(
          '[data-testid="clear-events"]'
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        const dragEl = document.querySelector(
          '.magic-drawer__drag'
        ) as HTMLElement

        if (dragEl) {
          dragEl.dispatchEvent(
            new PointerEvent('pointerdown', {
              clientX: 150,
              clientY: 250,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )

          await nextTick()
          await new Promise((r) => setTimeout(r, 100))

          const payload = getTestText('last-payload')
          expect(payload).toContain('"id":"event-drag-payload"')

          // Cleanup
          document.dispatchEvent(
            new PointerEvent('pointerup', {
              clientX: 150,
              clientY: 250,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )
        }
      } finally {
        unmount()
      }
    })

    it('emits afterDrag on pointer up', async () => {
      const { container, unmount } = mountWithApp(
        createEventTrackingWrapper('event-after-drag')
      )

      try {
        await openDrawer(container)

        const clearBtn = container.querySelector(
          '[data-testid="clear-events"]'
        ) as HTMLElement
        clearBtn.click()
        await nextTick()

        const dragEl = document.querySelector(
          '.magic-drawer__drag'
        ) as HTMLElement

        if (dragEl) {
          dragEl.dispatchEvent(
            new PointerEvent('pointerdown', {
              clientX: 200,
              clientY: 300,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )

          await new Promise((r) => setTimeout(r, 50))

          document.dispatchEvent(
            new PointerEvent('pointermove', {
              clientX: 200,
              clientY: 310,
              screenX: 200,
              screenY: 310,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )

          document.dispatchEvent(
            new PointerEvent('pointerup', {
              clientX: 200,
              clientY: 310,
              bubbles: true,
              pointerId: 1,
              isPrimary: true,
            })
          )

          await nextTick()
          await new Promise((r) => setTimeout(r, 200))

          const events = getTestText('events')
          expect(events).toContain('afterDrag')
        }
      } finally {
        unmount()
      }
    })
  })

})
