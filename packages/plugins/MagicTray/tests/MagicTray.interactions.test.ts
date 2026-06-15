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
      const draggedBottom = computed(() => api.state.dragged.bottom)
      const dragging = computed(() => api.state.dragging)
      return { progressBottom, draggedBottom, dragging }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.ProgressBottom}">{{ progressBottom }}</span>
        <span data-test-id="${TestId.DraggedBottom}">{{ draggedBottom }}</span>
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
      '.magic-tray-handle--bottom'
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
        '--magic-tray-drag-overshoot: 48px'
      )
    )
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))

    const handle = container.querySelector(
      '.magic-tray-handle--bottom'
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
})
