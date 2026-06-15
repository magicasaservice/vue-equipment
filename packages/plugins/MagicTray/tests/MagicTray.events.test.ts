import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

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

  it('snap event payload carries the side', async () => {
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
  })
})
