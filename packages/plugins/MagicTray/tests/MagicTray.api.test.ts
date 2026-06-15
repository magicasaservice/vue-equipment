import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function createTray(id: TrayId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const { progress, snapTo } = useMagicTray(id)
      return { progress, snapTo }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.ProgressBottom}">{{ progress.bottom }}</span>
        <span data-test-id="${TestId.ProgressRight}">{{ progress.right }}</span>
        <button data-test-id="${TestId.SnapBtn}" @click="snapTo('bottom', 0.5)">Snap</button>
        <MagicTrayContent>
          <div data-test-id="${TestId.Content}" style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicTray - Public API', () => {
  it('snapTo() drives the side progress towards the snap point', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.ApiSnap, { snapPoints: { bottom: [0, 0.5, 1] } })
    )
    await nextTick()
    await nextTick()

    ;(
      container.querySelector(`[data-test-id="${TestId.SnapBtn}"]`) as HTMLElement
    ).click()

    // The snap interpolates over ~300ms, progress should settle near 0.5
    await expect
      .poll(
        () => {
          const text = container.querySelector(
            `[data-test-id="${TestId.ProgressBottom}"]`
          )!.textContent
          return Number(text)
        },
        { timeout: 2000 }
      )
      .toBeGreaterThan(0.4)
  })
})
