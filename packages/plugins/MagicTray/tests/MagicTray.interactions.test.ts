import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, computed } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

import type { MagicTrayOptions, TraySide } from '../src/types/index'

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

function pointerX(type: string, clientX: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    clientX,
    clientY: 100,
  })
}

const MAGNETIC = {
  Magnetic: 'magnetic-left-value',
  Snapped: 'snapped-left-value',
}

function createMagneticTray(
  id: TrayId,
  options: MagicTrayOptions,
  side: TraySide = 'left',
  contentStyle = ''
) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const magneticValue = computed(() => api.state.magnetic[side])
      const snappedValue = computed(() => api.state.snapped[side])
      return { magneticValue, snappedValue }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <div style="position: absolute; width: 0; height: 0; overflow: hidden;">
          <span data-test-id="${MAGNETIC.Magnetic}">{{ magneticValue }}</span>
          <span data-test-id="${MAGNETIC.Snapped}">{{ snappedValue }}</span>
        </div>
        <MagicTrayContent style="${contentStyle}">
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

    // Drag the bottom edge upwards (decreasing clientY increases the inset)
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

    // Drag the right edge leftwards (decreasing clientX increases the inset)
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

  describe('drag mode', () => {
    // Rest fully open at the first snap point (0), then drag the bottom edge
    // far up in one move, without releasing, to see whether the point commits
    // mid-drag ('snap') or only once the pointer is released ('free').
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

    const active = (container: HTMLElement) =>
      container.querySelector(`[data-test-id="${TestId.Active1}"]`)!.textContent

    it('commits to the nearest point mid-drag, before release', async () => {
      const container = await mountOpenTray(TrayId.OptDragModeSnap, {
        ...base,
        drag: { mode: 'snap' },
      })

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 20))
      await nextTick()

      // Committed already — no pointerup dispatched yet
      expect(active(container)).toBe('1')

      document.dispatchEvent(pointer('pointerup', 20))
    })

    it('leaves free sides following the pointer until release', async () => {
      const container = await mountOpenTray(TrayId.OptDragModeFree, base)

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 20))
      await nextTick()

      // Still following the pointer — nothing committed until release
      expect(active(container)).toBe('0')

      document.dispatchEvent(pointer('pointerup', 20))
      await expect.poll(() => active(container), { timeout: 2000 }).toBe('1')
    })

    it('the per-side object form scopes snap mode to that side', async () => {
      const container = await mountOpenTray(TrayId.OptDragModeSnapObject, {
        ...base,
        drag: { mode: { bottom: 'snap' } },
      })

      const handle = container.querySelector(
        '.magic-tray-handle[data-side="bottom"]'
      ) as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', 200))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 20))
      await nextTick()

      expect(active(container)).toBe('1')

      document.dispatchEvent(pointer('pointerup', 20))
    })
  })
})

describe('MagicTray - Magnetism', () => {
  // The default, handle-derived geometry (no configured radius): the handle
  // straddles the resting edge, half its perpendicular size is the scrub anchor,
  // and the band is a quarter-thickness wide (radius) from the handle's edge, max
  // pull the same. Measuring the rendered handle keeps it deterministic despite the
  // browser's non-deterministic layout.
  function magneticGeometry(container: HTMLElement) {
    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const handle = container.querySelector(
      '.magic-tray-handle[data-side="left"]'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const hrect = handle.getBoundingClientRect()
    const snapped = readNumber(container, MAGNETIC.Snapped)
    const edgeX = rect.left + snapped
    const anchorHalf = hrect.width / 2
    const radius = anchorHalf / 2
    const pull = anchorHalf / 2
    const midY = rect.top + rect.height / 2
    // x of a point a fraction `f` of the way across the band, from the anchor
    // (f = 0, the handle's approached edge) toward the resting edge and past it
    const innerX = (f: number) => edgeX + anchorHalf - f * radius
    const outerX = (f: number) => edgeX - anchorHalf + f * radius
    // x in the staging region just past the handle's approached edge, where the
    // side arms before a scrub. The pull only engages by entering through here.
    const stageInner = edgeX + anchorHalf + radius
    const stageOuter = edgeX - anchorHalf - radius
    // Move the cursor into a staging region and let a frame settle, so the next
    // scrub starts armed
    async function stage(x: number) {
      movePointer(x, midY)
      await nextFrame()
      await nextTick()
    }
    return {
      rect,
      edgeX,
      anchorHalf,
      radius,
      pull,
      midY,
      innerX,
      outerX,
      stageInner,
      stageOuter,
      stage,
    }
  }

  it('pulls a left edge inward, ramping up as the cursor scrubs toward the edge', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticLeft, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { edgeX, innerX, pull, midY, stageInner, stage } =
      magneticGeometry(container)

    // Stage at the approached edge so the side arms, then scrub inward
    await stage(stageInner)

    // At the approached edge the scrub is below the half-pixel floor, so 0
    movePointer(innerX(0.02), midY)
    await nextFrame()
    await nextTick()
    const atAnchor = readNumber(container, MAGNETIC.Magnetic)

    // Halfway across the band the edge is pulled partway in
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    const midBand = readNumber(container, MAGNETIC.Magnetic)

    // Scrubbed to the resting edge the pull tops out at its max (a quarter of the handle)
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const atEdge = readNumber(container, MAGNETIC.Magnetic)

    expect(atAnchor).toBe(0)
    expect(midBand).toBeGreaterThan(atAnchor)
    expect(atEdge).toBeGreaterThan(midBand)
    expect(atEdge).toBeCloseTo(pull, 0)
  })

  it('does not pull when the cursor is deeper inside than the handle', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticDeep, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { edgeX, anchorHalf, midY } = magneticGeometry(container)

    // Past the handle's approached edge, before the band begins -> no pull
    movePointer(edgeX + anchorHalf + 60, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('eases the pull so a shallow scrub moves less than linear', async () => {
    async function pullAt(id: TrayId, easing: 'linear' | 'easeInOutCubic') {
      const { container } = mountWithApp(
        createMagneticTray(id, {
          snapPoints: { left: [0, '64px'] },
          magnetism: { sides: { left: { 0: 'inner' } }, easing },
        })
      )
      await settle()

      const { innerX, midY, stageInner, stage } = magneticGeometry(container)

      // Stage at the approached edge, then a shallow scrub a quarter into the band
      await stage(stageInner)
      movePointer(innerX(0.25), midY)
      await nextFrame()
      await nextTick()

      return readNumber(container, MAGNETIC.Magnetic)
    }

    const eased = await pullAt(TrayId.MagneticEased, 'easeInOutCubic')
    const linear = await pullAt(TrayId.MagneticLinear, 'linear')

    expect(eased).toBeGreaterThan(0)
    expect(eased).toBeLessThan(linear)
  })

  it('pulls to the configured max instead of the handle default', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticPull, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } }, pull: 40 },
      })
    )
    await settle()

    const { edgeX, pull, midY, stageInner, stage } = magneticGeometry(container)

    // The handle-derived default would be `pull`; the override lifts the max to 40
    expect(pull).toBeLessThan(40)

    // Stage, then scrub to the resting edge where the pull tops out
    await stage(stageInner)
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBeCloseTo(40, 0)
  })

  it('reaches max sooner with a narrower configured radius', async () => {
    // A configured radius anchors the band at the resting edge and spans `radius`
    // inward, so the handle no longer places it. A fixed distance in from each
    // band's start the narrow band has topped out where the wide one is still
    // ramping, so the configured radius sets the slope.
    async function pullInset(id: TrayId, radius: number) {
      const { container } = mountWithApp(
        createMagneticTray(id, {
          snapPoints: { left: [0, '64px'] },
          magnetism: { sides: { left: { 0: 'inner' } }, radius },
        })
      )
      await settle()

      const { edgeX, midY, stage } = magneticGeometry(container)

      // Stage just past the band's start (radius from the edge), then scrub 12px
      // in: past the narrow band (radius 10), still inside the wide one (20)
      await stage(edgeX + radius + 10)
      movePointer(edgeX + radius - 12, midY)
      await nextFrame()
      await nextTick()

      return readNumber(container, MAGNETIC.Magnetic)
    }

    const narrow = await pullInset(TrayId.MagneticRadiusNarrow, 10)
    const wide = await pullInset(TrayId.MagneticRadiusWide, 20)

    expect(narrow).toBeGreaterThan(wide)
  })

  it('holds the pull at max off the handle and runs it back down on return', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticHold, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { edgeX, anchorHalf, innerX, midY, stageInner, stage } =
      magneticGeometry(container)

    // Stage at the approached edge so the side arms
    await stage(stageInner)

    // Scrub all the way to the resting edge -> pull maxes out
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const atEdge = readNumber(container, MAGNETIC.Magnetic)

    // Carry on right off the far edge of the handle -> the pull holds at max,
    // it does not release just because the cursor left the handle
    movePointer(edgeX - 2 * anchorHalf, midY)
    await nextFrame()
    await nextTick()
    const offHandle = readNumber(container, MAGNETIC.Magnetic)

    // Move back into the band -> the pull runs in reverse, down from max
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    const back = readNumber(container, MAGNETIC.Magnetic)

    expect(atEdge).toBeGreaterThan(0)
    expect(offHandle).toBeCloseTo(atEdge, 5)
    expect(back).toBeLessThan(atEdge)
  })

  it('does not jump when the cursor reaches the band without staging', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticNoJump, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { anchorHalf, innerX, midY } = magneticGeometry(container)

    // Approach from the opposite side and land deep in the band without ever
    // staging at the inner edge -> the side stays idle, no jump to max
    movePointer(innerX(0.5) - 2 * anchorHalf, midY)
    await nextFrame()
    await nextTick()
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)

    // Slip in along the parallel axis at the same depth -> still no jump
    movePointer(innerX(0.5), midY - 1000)
    await nextFrame()
    await nextTick()
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('holds a latched max off the span but drops a partial scrub', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticGate, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { rect, edgeX, innerX, midY, stageInner, stage } =
      magneticGeometry(container)

    // Stage at the approached edge, then scrub all the way to max so it latches
    await stage(stageInner)
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const maxed = readNumber(container, MAGNETIC.Magnetic)
    expect(maxed).toBeGreaterThan(0)

    // A latched max holds even far above the handle's span -- once the scrub has
    // topped out the cursor can roam off the handle and the pull stays put
    movePointer(edgeX, rect.top - 200)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeCloseTo(maxed, 5)

    // Scrub back over the handle to a partial pull, then leave the span -> a
    // partial scrub does not hold, it drops to zero. The pull only lives where
    // the cursor is over the handle, never anywhere along the edge's line.
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)
    movePointer(innerX(0.5), rect.top - 200)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('pulls a left edge outward as the cursor scrubs in from outside', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticOuter, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { '64px': 'outer' } } },
      })
    )
    await settle()

    const { edgeX, outerX, midY, stageOuter, stage } =
      magneticGeometry(container)

    // Stage at the approached (outer) edge so the side arms, then scrub inward
    await stage(stageOuter)

    // At the handle's approached (outer) edge the scrub has barely started
    movePointer(outerX(0.02), midY)
    await nextFrame()
    await nextTick()
    const atAnchor = readNumber(container, MAGNETIC.Magnetic)

    // Halfway across the band the edge is pulled outward (negative)
    movePointer(outerX(0.5), midY)
    await nextFrame()
    await nextTick()
    const midBand = readNumber(container, MAGNETIC.Magnetic)

    // At the resting edge the outward pull is at its strongest
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const atEdge = readNumber(container, MAGNETIC.Magnetic)

    expect(atAnchor).toBeGreaterThan(-0.5)
    expect(midBand).toBeLessThan(atAnchor)
    expect(atEdge).toBeLessThan(midBand)
  })

  it('pulls inward from inside and outward from outside at a both point', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticBoth, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { '64px': 'both' } } },
      })
    )
    await settle()

    const { innerX, outerX, midY, stageInner, stageOuter, stage } =
      magneticGeometry(container)

    // Stage from inside, then scrub in -> pulls the edge inward (positive)
    await stage(stageInner)
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(0)

    // Stage from outside, then scrub in -> pulls the edge outward (negative)
    await stage(stageOuter)
    movePointer(outerX(0.5), midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeLessThan(0)
  })

  it('ramps from a configured start and latches the pull at stop', async () => {
    // A { start, stop } radius hangs the band off the resting edge: the pull
    // engages at `start`, eases up across the band, and tops out + latches at
    // `stop` (where the edge meets the cursor). Inside `stop` it holds at max.
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticBand, {
        snapPoints: { left: [0, '64px'] },
        magnetism: {
          sides: { left: { 0: 'inner' } },
          radius: { start: 60, stop: 20 },
          pull: 40,
        },
      })
    )
    await settle()

    const { edgeX, midY, stage } = magneticGeometry(container)

    // Stage past the engage distance so the side arms
    await stage(edgeX + 70)

    // Still outside `start` -> no pull
    movePointer(edgeX + 64, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)

    // Mid-band -> the pull is ramping, below its max
    movePointer(edgeX + 40, midY)
    await nextFrame()
    await nextTick()
    const mid = readNumber(container, MAGNETIC.Magnetic)
    expect(mid).toBeGreaterThan(0)
    expect(mid).toBeLessThan(40)

    // Inside `stop` -> latched at the configured max
    movePointer(edgeX + 10, midY)
    await nextFrame()
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeCloseTo(40, 0)
  })

  it('eases the pull back to rest when a both point flips approach mid-cross', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticSettle, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { '64px': 'both' } } },
      })
    )
    await settle()

    const { edgeX, anchorHalf, midY, stageInner, stage } =
      magneticGeometry(container)

    // Stage inside and scrub the inner pull to its max
    await stage(stageInner)
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const maxed = readNumber(container, MAGNETIC.Magnetic)
    expect(maxed).toBeGreaterThan(0)

    // Cross past the outer edge -> the approach flips and the target collapses
    // to rest, but the edge eases back rather than snapping
    movePointer(edgeX - 2 * anchorHalf, midY)
    await nextFrame()
    await nextFrame()
    await nextTick()
    // A couple of frames in the pull is still mostly held while it eases. A snap
    // to 0 (the bug) would already read near 0 here, independent of frame timing.
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeGreaterThan(maxed * 0.5)

    // Past the settle duration it has eased all the way back to rest
    await new Promise((r) => setTimeout(r, 400))
    await nextTick()
    expect(readNumber(container, MAGNETIC.Magnetic)).toBeCloseTo(0, 1)
  })

  it('pulls a top edge inward on the vertical axis', async () => {
    const { container } = mountWithApp(
      createMagneticTray(
        TrayId.MagneticTop,
        {
          snapPoints: { top: [0, '64px'] },
          magnetism: { sides: { top: { 0: 'inner' } } },
        },
        'top'
      )
    )
    await settle()

    // Geometry mirrors magneticGeometry but on the vertical axis: perp runs along
    // y, the span along x, and the handle thickness is its height
    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const handle = container.querySelector(
      '.magic-tray-handle[data-side="top"]'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const hrect = handle.getBoundingClientRect()
    const snapped = readNumber(container, MAGNETIC.Snapped)
    const edgeY = rect.top + snapped
    const anchorHalf = hrect.height / 2
    const radius = anchorHalf / 2
    const pull = anchorHalf / 2
    const midX = rect.left + rect.width / 2
    const innerY = (f: number) => edgeY + anchorHalf - f * radius

    // Stage below the handle's inner edge so the side arms, then scrub up
    movePointer(midX, edgeY + anchorHalf + radius)
    await nextFrame()
    await nextTick()

    // Halfway across the band the edge is pulled partway in
    movePointer(midX, innerY(0.5))
    await nextFrame()
    await nextTick()
    const midBand = readNumber(container, MAGNETIC.Magnetic)

    // Scrubbed to the resting edge the pull tops out at its max
    movePointer(midX, edgeY)
    await nextFrame()
    await nextTick()
    const atEdge = readNumber(container, MAGNETIC.Magnetic)

    expect(midBand).toBeGreaterThan(0)
    expect(atEdge).toBeGreaterThan(midBand)
    expect(atEdge).toBeCloseTo(pull, 0)
  })

  it('tracks the band to a handle shifted by a custom CSS offset', async () => {
    const { container } = mountWithApp(
      createMagneticTray(
        TrayId.MagneticOffset,
        {
          snapPoints: { left: [0, '64px'] },
          magnetism: { sides: { left: { 0: 'inner' } } },
        },
        'left',
        '--magic-tray-handle-offset-x-left: 0%'
      )
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const handle = container.querySelector(
      '.magic-tray-handle[data-side="left"]'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()
    const hrect = handle.getBoundingClientRect()
    const snapped = readNumber(container, MAGNETIC.Snapped)
    const edgeX = rect.left + snapped
    const anchorHalf = hrect.width / 2
    const radius = anchorHalf / 2
    const pull = anchorHalf / 2
    const midY = rect.top + rect.height / 2

    // The 0% offset drops the default -50% centering, so the handle no longer
    // straddles the edge: its outer edge sits on the resting edge, its inner edge
    // a full thickness inside. The band has to follow the handle there, a half a
    // thickness deeper than the centered default would place it.
    expect(Math.abs(hrect.left - edgeX)).toBeLessThan(1)

    // Band measured at the handle's real inner edge, scrubbed toward the rest edge
    const innerEdge = hrect.right
    const innerX = (f: number) => innerEdge - f * radius

    // Stage just past the handle's inner edge so the side arms, then scrub inward
    movePointer(innerEdge + radius, midY)
    await nextFrame()
    await nextTick()

    // At the inner edge the scrub is below the half-pixel floor, so 0
    movePointer(innerX(0.02), midY)
    await nextFrame()
    await nextTick()
    const atAnchor = readNumber(container, MAGNETIC.Magnetic)

    // Halfway across the band the edge is pulled partway in
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()
    const midBand = readNumber(container, MAGNETIC.Magnetic)

    // Scrubbed to the resting edge the pull tops out at its max
    movePointer(edgeX, midY)
    await nextFrame()
    await nextTick()
    const atEdge = readNumber(container, MAGNETIC.Magnetic)

    expect(atAnchor).toBe(0)
    expect(midBand).toBeGreaterThan(atAnchor)
    expect(atEdge).toBeGreaterThan(midBand)
    expect(atEdge).toBeCloseTo(pull, 0)
  })

  it('does not pull when the side rests at a non-magnetic snap point', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticInner, {
        snapPoints: { left: [0, '64px'] },
        initial: { snapPoints: { left: '64px' } },
        magnetism: { sides: { left: { 0: 'inner' } } },
      })
    )
    await settle()

    const { innerX, midY } = magneticGeometry(container)

    // Resting at the unconfigured '64px' point, only 0 is magnetic -> stays quiet
    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
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

  it('leaves edges untouched when magnetism is not configured', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticUnconfigured, {
        snapPoints: { left: [0, '64px'] },
      })
    )
    await settle()

    const { innerX, midY } = magneticGeometry(container)

    movePointer(innerX(0.5), midY)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })

  it('leaves edges untouched while disabled even with magnetism configured', async () => {
    const { container } = mountWithApp(
      createMagneticTray(TrayId.MagneticDisabled, {
        snapPoints: { left: [0, '64px'] },
        magnetism: { sides: { left: { 0: 'inner' } } },
        disabled: true,
      })
    )
    await settle()

    const inner = container.querySelector(
      '.magic-tray-content__inner'
    ) as HTMLElement
    const rect = inner.getBoundingClientRect()

    // Magnetism never attaches while disabled, so scrubbing to the edge does nothing
    movePointer(rect.left, rect.top + rect.height / 2)
    await nextFrame()
    await nextTick()

    expect(readNumber(container, MAGNETIC.Magnetic)).toBe(0)
  })
})
