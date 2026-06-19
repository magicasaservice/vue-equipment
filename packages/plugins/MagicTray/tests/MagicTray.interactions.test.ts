import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

import type { MagicTrayOptions } from '../src/types/index'

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

const MAGNETIC = {
  Magnetic: 'magnetic-left-value',
  Snapped: 'snapped-left-value',
}

function createMagneticTray(id: TrayId, options: MagicTrayOptions) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const magneticLeft = computed(() => api.state.magnetic.left)
      const snappedLeft = computed(() => api.state.snapped.left)
      return { magneticLeft, snappedLeft }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${MAGNETIC.Magnetic}">{{ magneticLeft }}</span>
        <span data-test-id="${MAGNETIC.Snapped}">{{ snappedLeft }}</span>
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

async function settle() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 100))
}

function readNumber(container: HTMLElement, id: string) {
  const el = container.querySelector(`[data-test-id="${id}"]`) as HTMLElement
  return parseFloat(el.textContent ?? '0')
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

describe('MagicTray - Magnetism', () => {
  it('pulls an enabled edge inward as the cursor approaches from inside', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticLeft, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Arm the side by first moving deeper inside than the magnetic radius
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)

    // Then approaching the edge from inside engages the pull
    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)

    // Cursor well past the magnetic radius -> no pull
    movePointer(edgeX + 400, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('eases the pull so a shallow approach moves less than linear', async () => {
    async function pullAt(id: TrayId, easing: 'linear' | 'easeInOutCubic') {
      const { container } = mountWithApp(
        createMagneticTray(id, {
          snapPoints: { left: [0, '64px'] },
          magnetism: {
            sides: { left: { 0: 'inner' } },
            radius: 80,
            pull: 24,
            easing,
          },
        })
      )
      await settle()

      const inner = container.querySelector(
        '.magic-tray-content__inner'
      ) as HTMLElement
      const rect = inner.getBoundingClientRect()
      const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
      const midY = rect.top + rect.height / 2

      // Arm from deep inside, then approach to a shallow penetration
      movePointer(edgeX + 120, midY)
      await nextFrame()
      await nextTick()
      movePointer(edgeX + 64, midY)
      await nextFrame()
      await nextTick()

      return readNumber(container, MAGNETIC.Magnetic)
    }

    const eased = await pullAt(TrayId.MagneticEased, 'easeInOutCubic')
    const linear = await pullAt(TrayId.MagneticLinear, 'linear')

    expect(eased).toBeGreaterThan(0)
    expect(eased).toBeLessThan(linear)
  })

  it('arms on a diagonal approach that enters over another edge', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticDiagonal, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)

    // Above the tray but deep on the left axis -> arms the left side
    movePointer(edgeX + 120, rect.top - 120)
    await nextFrame()
    await nextTick()

    // Corridor above the cap: perp shrinks below radius while the capsule
    // distance is still beyond it. The armed latch has to survive this.
    movePointer(edgeX + 40, rect.top - 90)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)

    // Arriving in the zone -> pull engages
    movePointer(edgeX + 6, rect.top + 30)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)
  })

  it('pulls a left edge even when the cursor is above the top', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticAbove, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)

    // Arm deep on the left axis, then enter the zone while above the top edge
    movePointer(edgeX + 120, rect.top + rect.height / 2)
    await nextFrame()
    await nextTick()

    movePointer(edgeX + 6, rect.top - 30)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)
  })

  it('does not pull beyond the capsule cap past the edge end', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticBeyondCap, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)

    // Arm deep on the left axis
    movePointer(edgeX + 120, rect.top + rect.height / 2)
    await nextFrame()
    await nextTick()

    // In the band horizontally, but far past the top end -> outside the capsule
    movePointer(edgeX + 6, rect.top - 200)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('keeps pulling just past the edge so leaving does not jump', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticPastEdge, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Arm from inside, then drift just past the resting edge to the outer side
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()

    movePointer(edgeX - 10, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)
  })

  it('does not initiate from a straight cross-axis approach', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticCrossAxis, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)

    // Descend straight down the band from above, never going deep on the x axis
    movePointer(edgeX + 20, rect.top - 120)
    await nextFrame()
    await nextTick()

    movePointer(edgeX + 20, rect.top + rect.height / 2)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('disarms after a pull so a later cross-axis descent does not trigger', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticStaleLatch, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Genuine inward pull -> arms and engages
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()
    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)

    // Leave the zone -> the engaged gesture ends and the latch disarms
    movePointer(edgeX + 6, rect.top - 300)
    await nextFrame()
    await nextTick()

    // A straight cross-axis descent must not ride the now-stale latch
    movePointer(edgeX + 10, rect.top - 200)
    await nextFrame()
    await nextTick()
    movePointer(edgeX + 10, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('does not pull when the edge is approached from outside', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticOutside, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Start outside the tray, then cross straight into the zone
    movePointer(rect.left - 40, midY)
    await nextFrame()
    await nextTick()

    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('does not pull when the side rests at a non-magnetic snap point', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticInner, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { 0: 'inner' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()

    // Resting at the unconfigured '64px' point, only 0 is magnetic so it stays quiet
    movePointer(
      rect.left + readNumber(container, MAGNETIC.Snapped) + 6,
      rect.top + rect.height / 2
    )
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('pulls outward when the cursor approaches an outer snap point from outside', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticOuter, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: {
          sides: { left: { '64px': 'outer' } },
          radius: 80,
          pull: 24,
        },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Arm by first moving deep outside the resting edge, then approach it
    movePointer(edgeX - 120, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)

    // Approaching from outside pulls the edge back out toward the cursor
    movePointer(edgeX - 6, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeLessThan(0)
  })

  it('does not pull from inside at an outer-only snap point', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticOuterInside, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: {
          sides: { left: { '64px': 'outer' } },
          radius: 80,
          pull: 24,
        },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Arm attempt from deep inside, then approach — an outer point ignores it
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()
    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('arms from either side at a snap point configured as both', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticBoth, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { '64px': 'both' } }, radius: 80, pull: 24 },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const edgeX = rect.left + readNumber(container, MAGNETIC.Snapped)
    const midY = rect.top + rect.height / 2

    // Arm from deep inside, then approach -> pulls the edge inward (positive)
    movePointer(edgeX + 120, midY)
    await nextFrame()
    await nextTick()
    movePointer(edgeX + 6, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)

    // Re-arm from deep outside, then approach -> pulls the edge outward (negative)
    movePointer(edgeX - 120, midY)
    await nextFrame()
    await nextTick()
    movePointer(edgeX - 6, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeLessThan(0)
  })

  it('throws when a magnetic snap point is not configured in snapPoints', () => {
    expect(() =>
      mountWithApp(
        createMagneticTray(TrayId.MagneticInvalid, {
          snapPoints: { left: [0, '64px'] },
          magnetism: { sides: { left: { '128px': 'inner' } } },
        })
      )
    ).toThrow(/snapPoints\.left/)
  })

  it('leaves edges untouched when magnetism is disabled', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticDisabled, {
        snapPoints: { left: [0, '64px'] },
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()

    movePointer(
      rect.left + readNumber(container, MAGNETIC.Snapped) + 6,
      rect.top + rect.height / 2
    )
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })
})
