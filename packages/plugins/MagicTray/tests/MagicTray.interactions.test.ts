import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

function createTray(
  id: TrayId,
  options: Record<string, unknown> = {},
  contentStyle = ''
) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const progressBottom = computed(() => api.progress.value.bottom)
      const progressRight = computed(() => api.progress.value.right)
      const draggedBottom = computed(() => api.state.dragged.bottom)
      const activeBottom = computed(() => api.activeSnapPoint.value.bottom)
      const dragging = computed(() => api.state.dragging)
      return {
        progressBottom,
        progressRight,
        draggedBottom,
        activeBottom,
        dragging,
      }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
        <span data-test-id="${TestId.ProgressRight}">{{ progressRight }}</span>
        <span data-test-id="${TestId.DraggedBottom}">{{ draggedBottom }}</span>
        <span data-test-id="${TestId.Active1}">{{ activeBottom }}</span>
        <span data-test-id="${TestId.Content}">{{ dragging }}</span>
        <MagicTrayContent style="${contentStyle}">
          <div style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

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

function pointerX(type: string, screenX: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    screenX,
    screenY: 100,
  })
}

describe('MagicTray - Interactions', () => {
  it('dragging the bottom handle past the threshold snaps the side inward', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.RenderHandles, {
        snapPoints: { bottom: [0, 0.5, 1] },
      })
    )
    // Allow the rect to settle
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const handle = container.querySelector(
      '.magic-tray-handle[data-side="bottom"]'
    ) as HTMLElement
    expect(handle).not.toBeNull()

    // Drag the bottom edge upwards (decreasing screenY increases the inset)
    handle.dispatchEvent(pointer('pointerdown', 200))
    await nextTick()
    document.dispatchEvent(pointer('pointermove', 60))
    await nextTick()
    document.dispatchEvent(pointer('pointerup', 60))

    // The side should settle on a non-zero snap point
    await expect
      .poll(
        () =>
          Number(
            container.querySelector(`[data-test-id="${TestId.ProgressBottom}"]`)!
              .textContent
          ),
        { timeout: 2000 }
      )
      .toBeGreaterThan(0)
  })

  it('rubber-bands past the open bound and springs back on release', async () => {
    const { container } = mountWithApp(
      createTray(
        TrayId.Overshoot,
        {
          snapPoints: { bottom: [0, 0.5, 1] },
        },
        '--magic-tray-drag-overshoot-outer: 48px'
      )
    )
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const handle = container.querySelector(
      '.magic-tray-handle[data-side="bottom"]'
    ) as HTMLElement
    expect(handle).not.toBeNull()

    const read = () =>
      Number(
        container.querySelector(`[data-test-id="${TestId.DraggedBottom}"]`)!
          .textContent
      )

    // At rest the bottom edge sits flush with the content, inset by the
    // reserved padding (48px). Dragging the edge further down moves the inset
    // toward 0, into the reserved padding — the elastic overdrag.
    await expect.poll(read, { timeout: 2000 }).toBe(48)

    handle.dispatchEvent(pointer('pointerdown', 100))
    await nextTick()
    document.dispatchEvent(pointer('pointermove', 220))
    await nextTick()

    const overdragged = read()
    // Below the open position (48) but bounded within the padding ([0, 48])
    expect(overdragged).toBeLessThan(48)
    expect(overdragged).toBeGreaterThanOrEqual(0)

    document.dispatchEvent(pointer('pointerup', 220))

    // It should spring back to the open position
    await expect.poll(read, { timeout: 2000 }).toBe(48)
  })

  it('dragging a horizontal-axis side (right) snaps it inward', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.OptSideRight, {
        snapPoints: { right: [0, 0.5, 1] },
      })
    )
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const handle = container.querySelector(
      '.magic-tray-handle[data-side="right"]'
    ) as HTMLElement
    expect(handle).not.toBeNull()

    // Drag the right edge leftwards (decreasing screenX increases the inset)
    handle.dispatchEvent(pointerX('pointerdown', 200))
    await nextTick()
    document.dispatchEvent(pointerX('pointermove', 60))
    await nextTick()
    document.dispatchEvent(pointerX('pointerup', 60))

    await expect
      .poll(
        () =>
          Number(
            container.querySelector(`[data-test-id="${TestId.ProgressRight}"]`)!
              .textContent
          ),
        { timeout: 2000 }
      )
      .toBeGreaterThan(0)
  })

  it('pointercancel settles the drag like pointerup', async () => {
    const { container } = mountWithApp(
      createTray(TrayId.RenderHandles, {
        snapPoints: { bottom: [0, 0.5, 1] },
      })
    )
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const handle = container.querySelector(
      '.magic-tray-handle[data-side="bottom"]'
    ) as HTMLElement

    const dragging = () =>
      container.querySelector(`[data-test-id="${TestId.Content}"]`)!.textContent

    handle.dispatchEvent(pointer('pointerdown', 200))
    await nextTick()
    document.dispatchEvent(pointer('pointermove', 120))
    await nextTick()
    expect(dragging()).toBe('true')

    document.dispatchEvent(pointer('pointercancel', 120))
    await nextTick()
    expect(dragging()).toBe('false')
  })

  describe('threshold distance advances symmetrically', () => {
    // Start fully open at the middle snap point, then drag a small amount —
    // past threshold.distance (8px) but well short of the midpoint between
    // snap points (~50px) — so the move only commits if the distance
    // threshold drives a directional snap rather than an absolute closest one.
    const options = {
      snapPoints: { bottom: [0, 0.5, 1] },
      initial: { snapPoints: { bottom: 0.5 } },
      threshold: { distance: 8, momentum: 99999 },
    }
    const style = '--magic-tray-drag-overshoot-outer: 48px'

    async function mountMidTray(id: TrayId) {
      const { container } = mountWithApp(createTray(id, options, style))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      // Rests at the middle snap point before dragging
      await expect
        .poll(
          () =>
            Number(
              container.querySelector(`[data-test-id="${TestId.ProgressBottom}"]`)!
                .textContent
            ),
          { timeout: 2000 }
        )
        .toBeCloseTo(0.5, 1)

      return container
    }

    const active = (container: HTMLElement) =>
      container.querySelector(`[data-test-id="${TestId.Active1}"]`)!.textContent

    it('dragging up past the threshold advances to the next point above', async () => {
      const container = await mountMidTray(TrayId.OptThresholdDirUp)
      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 170))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 170))

      await expect.poll(() => active(container), { timeout: 2000 }).toBe('1')
    })

    it('dragging down past the threshold advances to the next point below', async () => {
      const container = await mountMidTray(TrayId.OptThresholdDirDown)
      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 230))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 230))

      await expect.poll(() => active(container), { timeout: 2000 }).toBe('0')
    })
  })

  describe('snap mode steps through points in order', () => {
    // Rest fully open at the first snap point (0), then drag the bottom edge
    // far up — past the midpoint between 0.5 and 1 — so the live position is
    // closest to 1. In 'step' mode the edge should advance only to the
    // adjacent point (0.5); in 'closest' mode it jumps straight to 1.
    const base = {
      snapPoints: { bottom: [0, 0.5, 1] },
      threshold: { distance: 8, momentum: 99999 },
    }
    const style = '--magic-tray-drag-overshoot-outer: 48px'

    async function mountOpenTray(id: TrayId, options: Record<string, unknown>) {
      const { container } = mountWithApp(createTray(id, options, style))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await expect.poll(() => active(container), { timeout: 2000 }).toBe('0')

      return container
    }

    async function dragFarUp(container: HTMLElement) {
      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 20))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 20))
    }

    const active = (container: HTMLElement) =>
      container.querySelector(`[data-test-id="${TestId.Active1}"]`)!.textContent

    it("'step' advances only to the adjacent point, skipping none", async () => {
      const container = await mountOpenTray(TrayId.OptSnapModeStep, {
        ...base,
        snap: { mode: 'step' },
      })

      await dragFarUp(container)

      await expect.poll(() => active(container), { timeout: 2000 }).toBe('0.5')
    })

    it("'closest' jumps to the nearest point in the drag direction", async () => {
      const container = await mountOpenTray(TrayId.OptSnapModeClosest, {
        ...base,
        snap: { mode: 'closest' },
      })

      await dragFarUp(container)

      await expect.poll(() => active(container), { timeout: 2000 }).toBe('1')
    })
  })
})
