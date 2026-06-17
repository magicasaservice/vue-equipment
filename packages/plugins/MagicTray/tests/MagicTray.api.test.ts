import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function createTray(
  id: TrayId,
  options: Record<string, unknown> = {},
  snapPoint: number = 0.5
) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const { progress, activeSnapPoint, snapTo } = useMagicTray(id)
      return { progress, activeSnapPoint, snapTo, snapPoint }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.ProgressTop}">{{ progress.top }}</span>
        <span data-test-id="${TestId.ProgressRight}">{{ progress.right }}</span>
        <span data-test-id="${TestId.ProgressBottom}">{{ progress.bottom }}</span>
        <span data-test-id="${TestId.ProgressLeft}">{{ progress.left }}</span>
        <span data-test-id="${TestId.Content}">{{ activeSnapPoint.bottom }}</span>
        <button data-test-id="${TestId.SnapBtn}" @click="snapTo('bottom', snapPoint)">Snap</button>
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

function read(container: HTMLElement, id: TestId) {
  return Number(
    container.querySelector(`[data-test-id="${id}"]`)!.textContent
  )
}

describe('MagicTray - Public API', () => {
  it('exposes a progress object for every side, starting at 0', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.ApiSnap, { snapPoints: { bottom: [0, 0.5, 1] } })
    )
    await nextTick()
    await nextTick()

    expect(read(container, TestId.ProgressTop)).toBe(0)
    expect(read(container, TestId.ProgressRight)).toBe(0)
    expect(read(container, TestId.ProgressBottom)).toBe(0)
    expect(read(container, TestId.ProgressLeft)).toBe(0)
  })

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
      .poll(() => read(container, TestId.ProgressBottom), { timeout: 2000 })
      .toBeGreaterThan(0.4)
  })

  it('snapTo() to the clipped extreme drives progress to 1', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.ApiSnap, { snapPoints: { bottom: [0, 0.5, 1] } }, 1)
    )
    await nextTick()
    await nextTick()

    ;(
      container.querySelector(`[data-test-id="${TestId.SnapBtn}"]`) as HTMLElement
    ).click()

    await expect
      .poll(() => read(container, TestId.ProgressBottom), { timeout: 2000 })
      .toBeGreaterThan(0.9)
  })

  it('records the active snap point after snapping', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.ApiSnap, { snapPoints: { bottom: [0, 0.5, 1] } })
    )
    await nextTick()
    await nextTick()

    ;(
      container.querySelector(`[data-test-id="${TestId.SnapBtn}"]`) as HTMLElement
    ).click()

    await expect
      .poll(
        () =>
          container.querySelector(`[data-test-id="${TestId.Content}"]`)!
            .textContent,
        { timeout: 2000 }
      )
      .toBe('0.5')
  })
})
