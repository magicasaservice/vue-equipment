import { describe, it, expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicModalProvider from '../src/components/MagicModalProvider.vue'
import MagicModalTrigger from '../src/components/MagicModalTrigger.vue'
import MagicModalTeleport from '../src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from '../src/components/MagicModalBackdrop.vue'
import MagicModalContent from '../src/components/MagicModalContent.vue'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { ModalId, TestId } from './enums'

function createModal(id: ModalId) {
  return defineComponent({
    components: { MagicModalProvider, MagicModalTrigger, MagicModalTeleport, MagicModalBackdrop, MagicModalContent },
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

      function clearEvents() { events.length = 0; lastPayload.value = null }
      return { events, lastPayload, clearEvents }
    },
    template: `
      <MagicModalProvider id="${id}">
        <button data-test-id="${TestId.ClearEvents}" @click="clearEvents">Clear</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.LastPayload}">{{ JSON.stringify(lastPayload) }}</span>
        <MagicModalTrigger>
          <button data-test-id="${TestId.Trigger}">Open</button>
        </MagicModalTrigger>
        <MagicModalTeleport>
          <MagicModalBackdrop />
          <MagicModalContent>
            <div style="height: 200px; width: 100%;"><button>Focusable</button></div>
          </MagicModalContent>
        </MagicModalTeleport>
      </MagicModalProvider>
    `,
  })
}

async function openModal(container: HTMLElement) {
  const btn = container.querySelector(`[data-test-id="${TestId.Trigger}"]`) as HTMLElement
  btn.click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 600))
}

function getTestText(id: TestId): string {
  return document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
}

describe('MagicModal - Events', () => {
  describe('transition lifecycle', () => {
    it('emits beforeEnter, enter, afterEnter on open', async () => {
      const { container, unmount } = mountWithApp(createModal(ModalId.EventOpen))
      try {
        await openModal(container)
        const events = getTestText(TestId.Events)
        expect(events).toContain('beforeEnter')
        expect(events).toContain('enter')
        expect(events).toContain('afterEnter')
      } finally { unmount() }
    })

    it('emits beforeLeave, leave, afterLeave on close', async () => {
      const { container, unmount } = mountWithApp(createModal(ModalId.EventClose))
      try {
        await openModal(container)
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
      const { container, unmount } = mountWithApp(createModal(ModalId.EventOrder))
      try {
        await openModal(container)
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
      const { container, unmount } = mountWithApp(createModal(ModalId.EventLeaveOrder))
      try {
        await openModal(container)
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

    it('enter event payload includes modal id', async () => {
      const { container, unmount } = mountWithApp(createModal(ModalId.EventPayload))
      try {
        await openModal(container)
        expect(JSON.parse(getTestText(TestId.LastPayload))).toBe(ModalId.EventPayload)
      } finally { unmount() }
    })
  })
})
