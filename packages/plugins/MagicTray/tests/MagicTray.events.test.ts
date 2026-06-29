import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive, ref, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

import type { MagicTrayOptions } from '../src/types/index'

function pointer(type: string, clientY: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    clientX: 100,
    clientY,
  })
}

function movePointer(x: number, y: number) {
  document.dispatchEvent(
    new PointerEvent('pointermove', {
      bubbles: true,
      pointerId: 1,
      isPrimary: true,
      clientX: x,
      clientY: y,
    })
  )
}

function nextFrame() {
  return new Promise((r) => requestAnimationFrame(() => r(null)))
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

function createMagneticTray(id: TrayId, options: MagicTrayOptions) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      emitter.on('magnet', (data: unknown) => {
        events.push('magnet')
        lastPayload.value = data
      })

      const snappedLeft = computed(() => api.state.snapped.left)

      return { events, lastPayload, snappedLeft }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.Content}">{{ JSON.stringify(lastPayload) }}</span>
        <span data-test-id="${TestId.SnapAll}">{{ snappedLeft }}</span>
        <MagicTrayContent>
          <div style="width: 240px; height: 240px;">Content</div>
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

  it('emits magnetism progress as the cursor pulls a magnetic edge', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.EventMagnetism, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const snapped = Number(
      container.querySelector(`[data-test-id="${TestId.SnapAll}"]`)!.textContent
    )
    const edgeX = rect.left + snapped
    const midY = rect.top + rect.height / 2

    // Arm from deep inside, then approach the edge to engage the pull
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()
    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()

    const events = container.querySelector(
      `[data-test-id="${TestId.Events}"]`
    )!.textContent!
    expect(events).toContain('magnet')

    const payload = JSON.parse(
      container.querySelector(`[data-test-id="${TestId.Content}"]`)!.textContent!
    )
    expect(payload.id).toBe(TrayId.EventMagnetism)
    expect(payload.side).toBe('left')
    expect(payload.value).toBeGreaterThan(0)
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

    it('drag payload carries the side and value alongside the id', async () => {
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
      expect(payload.side).toBe('bottom')
      expect(typeof payload.value).toBe('number')

      document.dispatchEvent(pointer('pointerup', 120))
    })
  })
})
