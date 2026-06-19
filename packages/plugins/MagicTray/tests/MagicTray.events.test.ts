import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function pointer(type: string, screenY: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    screenX: 100,
    screenY,
  })
}

function createDragTray(id: TrayId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      useMagicTray(id)
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('beforeDrag', (data: unknown) => {
        events.push('beforeDrag')
        lastPayload.value = data
      })
      emitter.on('drag', () => events.push('drag'))
      emitter.on('afterDrag', () => events.push('afterDrag'))
      emitter.on('progress', () => events.push('progress'))

      return { events, lastPayload }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.Content}">{{ JSON.stringify(lastPayload) }}</span>
        <MagicTrayContent>
          <div style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

function createTray(id: TrayId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const { snapTo } = useMagicTray(id)
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('beforeSnap', (data: unknown) => {
        events.push('beforeSnap')
        lastPayload.value = data
      })
      emitter.on('snapTo', () => events.push('snapTo'))
      emitter.on('afterSnap', () => events.push('afterSnap'))

      return { snapTo, events, lastPayload }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.Content}">{{ JSON.stringify(lastPayload) }}</span>
        <button data-test-id="${TestId.SnapBtn}" @click="snapTo('bottom', 0.5)">Snap</button>
        <MagicTrayContent>
          <div style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicTray - Events', () => {
  it('emits snapTo, beforeSnap and afterSnap when snapping a side', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.EventSnap, { snapPoints: { bottom: [0, 0.5, 1] } })
    )
    await nextTick()
    await nextTick()

    ;(
      container.querySelector(`[data-test-id="${TestId.SnapBtn}"]`) as HTMLElement
    ).click()

    await expect
      .poll(
        () =>
          container.querySelector(`[data-test-id="${TestId.Events}"]`)!
            .textContent,
        { timeout: 2000 }
      )
      .toContain('afterSnap')

    const events = container.querySelector(
      `[data-test-id="${TestId.Events}"]`
    )!.textContent!

    expect(events).toContain('snapTo')
    expect(events).toContain('beforeSnap')
    expect(events).toContain('afterSnap')
  })

  it('snap event payload nests the side inside the snapPoint', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.EventSnap, { snapPoints: { bottom: [0, 0.5, 1] } })
    )
    await nextTick()
    await nextTick()

    ;(
      container.querySelector(`[data-test-id="${TestId.SnapBtn}"]`) as HTMLElement
    ).click()

    await expect
      .poll(
        () =>
          container.querySelector(`[data-test-id="${TestId.Events}"]`)!
            .textContent,
        { timeout: 2000 }
      )
      .toContain('beforeSnap')

    const payload = JSON.parse(
      container.querySelector(`[data-test-id="${TestId.Content}"]`)!.textContent!
    )
    expect(payload.id).toBe(TrayId.EventSnap)
    expect(payload.side).toBeUndefined()
    expect(payload.snapPoint).toEqual({ side: 'bottom', point: 0.5 })
  })

  describe('drag lifecycle', () => {
    it('emits beforeDrag, drag and afterDrag across a pointer drag', async () => {
      const { container } = mountWithApp(
        createDragTray(TrayId.RenderHandles, {
          snapPoints: { bottom: [0, 0.5, 1] },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 120))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 120))
      await nextTick()

      const events = container.querySelector(
        `[data-test-id="${TestId.Events}"]`
      )!.textContent!

      expect(events).toContain('beforeDrag')
      expect(events).toContain('drag')
      expect(events).toContain('afterDrag')
    })

    it('emits progress while the inset changes', async () => {
      const { container } = mountWithApp(
        createDragTray(TrayId.RenderHandles, {
          snapPoints: { bottom: [0, 0.5, 1] },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 60))

      await expect
        .poll(
          () =>
            container.querySelector(`[data-test-id="${TestId.Events}"]`)!
              .textContent,
          { timeout: 2000 }
        )
        .toContain('progress')
    })

    it('drag payload nests the side inside the drag value', async () => {
      const { container } = mountWithApp(
        createDragTray(TrayId.RenderHandles, {
          snapPoints: { bottom: [0, 0.5, 1] },
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 120))
      await nextTick()

      const payload = JSON.parse(
        container.querySelector(`[data-test-id="${TestId.Content}"]`)!
          .textContent!
      )
      expect(payload.id).toBe(TrayId.RenderHandles)
      expect(payload.side).toBeUndefined()
      expect(payload.drag.side).toBe('bottom')
      expect(typeof payload.drag.value).toBe('number')

      document.dispatchEvent(pointer('pointerup', 120))
    })
  })
})
