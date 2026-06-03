import { describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTrigger from '../src/components/MagicDrawerTrigger.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { DrawerId, TestId } from './enums'

function createDrawer(id: DrawerId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicDrawerProvider, MagicDrawerTrigger, MagicDrawerTeleport, MagicDrawerBackdrop, MagicDrawerContent },
    setup() {
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('beforeEnter', (data: unknown) => { events.push('beforeEnter'); lastPayload.value = data })
      emitter.on('enter', () => events.push('enter'))
      emitter.on('afterEnter', () => events.push('afterEnter'))
      emitter.on('beforeLeave', () => events.push('beforeLeave'))
      emitter.on('leave', () => events.push('leave'))
      emitter.on('afterLeave', () => events.push('afterLeave'))
      emitter.on('beforeDrag', (data: unknown) => { events.push('beforeDrag'); lastPayload.value = data })
      emitter.on('drag', () => events.push('drag'))
      emitter.on('afterDrag', () => events.push('afterDrag'))
      emitter.on('snapTo', (data: unknown) => { events.push('snapTo'); lastPayload.value = data })
      emitter.on('beforeSnap', () => events.push('beforeSnap'))
      emitter.on('afterSnap', () => events.push('afterSnap'))

      function clearEvents() { events.length = 0; lastPayload.value = null }
      return { events, lastPayload, clearEvents }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <button data-test-id="${TestId.ClearEvents}" @click="clearEvents">Clear</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.LastPayload}">{{ JSON.stringify(lastPayload) }}</span>
        <MagicDrawerTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicDrawerTrigger>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent>
            <div style="height: 200px; width: 100%;"><button>Focusable</button></div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
    data() { return { options } },
  })
}

async function openDrawer(container: HTMLElement) {
  const btn = container.querySelector(`[data-test-id="${TestId.Trigger}"]`) as HTMLElement
  btn.click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 600))
}

function getTestText(id: TestId): string {
  return document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
}

describe('MagicDrawer - Events', () => {
  describe('transition lifecycle', () => {
    it('emits beforeEnter, enter, afterEnter on open', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventOpen))
      try {
        await openDrawer(container)
        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
        expect(events).toContain('afterEnter')
      } finally { unmount() }
    })

    it('emits beforeLeave, leave, afterLeave on close', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventClose))
      try {
        await openDrawer(container)
        ;(container.querySelector(`[data-test-id="${TestId.ClearEvents}"]`) as HTMLElement).click()
        await nextTick()

        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeLeave')
        expect(events).toContain('leave')
        expect(events).toContain('afterLeave')
      } finally { unmount() }
    })

    it('enter events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventOrder))
      try {
        await openDrawer(container)
        const events = getTestText(TestId.Events).split(',')
        const bi = events.indexOf('beforeEnter')
        const ei = events.indexOf('enter')
        const ai = events.indexOf('afterEnter')
        expect(bi).toBeGreaterThanOrEqual(0)
        expect(bi).toBeLessThan(ei)
        expect(ei).toBeLessThan(ai)
      } finally { unmount() }
    })

    it('leave events fire in correct order', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventLeaveOrder))
      try {
        await openDrawer(container)
        ;(container.querySelector(`[data-test-id="${TestId.ClearEvents}"]`) as HTMLElement).click()
        await nextTick()

        await userEvent.keyboard('{Escape}')
        await nextTick()
        await new Promise((r) => setTimeout(r, 600))

        const events = getTestText(TestId.Events).split(',')
        const bi = events.indexOf('beforeLeave')
        const li = events.indexOf('leave')
        const ai = events.indexOf('afterLeave')
        expect(bi).toBeGreaterThanOrEqual(0)
        expect(bi).toBeLessThan(li)
        expect(li).toBeLessThan(ai)
      } finally { unmount() }
    })

    it('enter event payload includes drawer id', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventPayload))
      try {
        await openDrawer(container)
        expect(JSON.parse(getTestText(TestId.LastPayload))).toBe(DrawerId.EventPayload)
      } finally { unmount() }
    })
  })

  describe('drag events', () => {
    it('emits beforeDrag on pointerdown', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventDrag))
      try {
        await openDrawer(container)
        ;(container.querySelector(`[data-test-id="${TestId.ClearEvents}"]`) as HTMLElement).click()
        await nextTick()

        const dragEl = document.querySelector('.magic-drawer-content__drag') as HTMLElement
        dragEl.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 300, bubbles: true, pointerId: 1, isPrimary: true }))
        await nextTick()
        await new Promise((r) => setTimeout(r, 100))

        expect(getTestText(TestId.Events)).toContain('beforeDrag')

        document.dispatchEvent(new PointerEvent('pointerup', { clientX: 200, clientY: 300, bubbles: true, pointerId: 1, isPrimary: true }))
      } finally { unmount() }
    })

    it('drag payload includes correct id', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventDragPayload))
      try {
        await openDrawer(container)
        ;(container.querySelector(`[data-test-id="${TestId.ClearEvents}"]`) as HTMLElement).click()
        await nextTick()

        const dragEl = document.querySelector('.magic-drawer-content__drag') as HTMLElement
        dragEl.dispatchEvent(new PointerEvent('pointerdown', { clientX: 150, clientY: 250, bubbles: true, pointerId: 1, isPrimary: true }))
        await nextTick()
        await new Promise((r) => setTimeout(r, 100))

        expect(JSON.parse(getTestText(TestId.LastPayload)).id).toBe(DrawerId.EventDragPayload)

        document.dispatchEvent(new PointerEvent('pointerup', { clientX: 150, clientY: 250, bubbles: true, pointerId: 1, isPrimary: true }))
      } finally { unmount() }
    })

    it('emits afterDrag on pointerup', async () => {
      const { container, unmount } = mountWithApp(createDrawer(DrawerId.EventAfterDrag))
      try {
        await openDrawer(container)
        ;(container.querySelector(`[data-test-id="${TestId.ClearEvents}"]`) as HTMLElement).click()
        await nextTick()

        const dragEl = document.querySelector('.magic-drawer-content__drag') as HTMLElement
        dragEl.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 300, bubbles: true, pointerId: 1, isPrimary: true }))
        await new Promise((r) => setTimeout(r, 50))

        document.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 310, screenX: 200, screenY: 310, bubbles: true, pointerId: 1, isPrimary: true }))
        document.dispatchEvent(new PointerEvent('pointerup', { clientX: 200, clientY: 310, bubbles: true, pointerId: 1, isPrimary: true }))
        await nextTick()
        await new Promise((r) => setTimeout(r, 200))

        expect(getTestText(TestId.Events)).toContain('afterDrag')
      } finally { unmount() }
    })
  })
})
