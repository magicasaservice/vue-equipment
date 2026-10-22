import { describe, it, expect, vi } from 'vitest'
import {
  defineComponent,
  nextTick,
  reactive,
  ref,
  computed,
  onBeforeUnmount,
} from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

import type { MagicEmitterEvents } from '../../MagicEmitter'
import type { MagicTrayOptions, MagicTraySnapPoint } from '../src/types/index'

// No outer overshoot, so a bottom inset in pixels equals the snap point value
const style = '--magic-tray-drag-overshoot-outer: 0px'

const range = { min: '60px', max: '140px' } as const

const base: MagicTrayOptions = {
  snapPoints: { bottom: [0, range] },
  threshold: { distance: 8, momentum: 99999 },
}

function createTray(
  id: TrayId,
  options: MagicTrayOptions,
  snapTarget: MagicTraySnapPoint = '120px'
) {
  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent },
    setup() {
      const api = useMagicTray(id)
      const emitter = useMagicEmitter()
      const active = computed(() => api.activeSnapPoint.value.bottom)
      const dragged = computed(() => api.state.dragged.bottom)
      const afterSnap = reactive<Array<MagicTraySnapPoint>>([])
      const afterSnapActive = reactive<Array<MagicTraySnapPoint | undefined>>(
        []
      )
      const willSnapTo = reactive<Array<MagicTraySnapPoint>>([])
      const height = ref(200)

      function onAfterSnap(payload: MagicEmitterEvents['afterSnap']) {
        const { snapPoint } = payload
        if (
          payload.id === id &&
          typeof snapPoint === 'object' &&
          'side' in snapPoint
        ) {
          afterSnap.push(snapPoint.point)
          afterSnapActive.push(api.activeSnapPoint.value.bottom)
        }
      }

      function onWillSnapTo(payload: MagicEmitterEvents['willSnapTo']) {
        if (payload.id === id) {
          willSnapTo.push(payload.snapPoint)
        }
      }

      emitter.on('afterSnap', onAfterSnap)
      emitter.on('willSnapTo', onWillSnapTo)

      onBeforeUnmount(() => {
        emitter.off('afterSnap', onAfterSnap)
        emitter.off('willSnapTo', onWillSnapTo)
      })

      return {
        options,
        active,
        dragged,
        afterSnap,
        afterSnapActive,
        willSnapTo,
        height,
        snap: () => api.snapTo('bottom', snapTarget),
        grow: () => (height.value = 240),
      }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.Active1}">{{ active }}</span>
        <span data-test-id="${TestId.DraggedBottom}">{{ dragged }}</span>
        <span data-test-id="${TestId.Events}">{{ afterSnap.join(',') }}</span>
        <span data-test-id="${TestId.AfterSnapActive}">{{ afterSnapActive.join(',') }}</span>
        <span data-test-id="${TestId.WillSnapTo}">{{ willSnapTo.join(',') }}</span>
        <button data-test-id="${TestId.SnapBtn}" @click="snap">Snap</button>
        <button data-test-id="${TestId.GrowBtn}" @click="grow">Grow</button>
        <MagicTrayContent style="${style}">
          <div :style="{ width: '200px', height: height + 'px' }">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
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

function read(container: HTMLElement, testId: TestId) {
  return container.querySelector(`[data-test-id="${testId}"]`)!.textContent
}

function click(container: HTMLElement, testId: TestId) {
  container.querySelector<HTMLElement>(`[data-test-id="${testId}"]`)!.click()
}

async function mountAt(
  id: TrayId,
  options: MagicTrayOptions,
  inset: number,
  snapTarget?: MagicTraySnapPoint
) {
  const { container } = mountWithApp(createTray(id, options, snapTarget))
  await nextTick()
  await new Promise((r) => setTimeout(r, 100))

  await expect
    .poll(() => Number(read(container, TestId.DraggedBottom)), {
      timeout: 2000,
    })
    .toBe(inset)

  return container
}

// Moves the bottom edge inward by `distance` pixels, negative to move it out
async function drag(container: HTMLElement, distance: number) {
  const handle = container.querySelector<HTMLElement>(
    '.magic-tray-handle[data-side="bottom"]'
  )!

  handle.dispatchEvent(pointer('pointerdown', 200))
  await nextTick()
  await move(distance)
}

// Moves the pointer of a running drag to `distance` pixels from its start
async function move(distance: number) {
  document.dispatchEvent(pointer('pointermove', 200 - distance))
  await nextTick()
}

function release(distance: number) {
  document.dispatchEvent(pointer('pointerup', 200 - distance))
}

describe('MagicTray - Ranges', () => {
  describe('release', () => {
    it('rests where it was let go inside a range', async () => {
      const container = await mountAt(TrayId.RangeRestInside, base, 0)

      await drag(container, 100)
      release(100)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('100px')
      expect(read(container, TestId.DraggedBottom)).toBe('100')
    })

    it('snaps to the nearer end of a range it fell short of', async () => {
      const container = await mountAt(TrayId.RangeSnapToEnd, base, 0)

      await drag(container, 30)
      release(30)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('60px')
    })

    it('returns to the edge when it leaves a range by less than the threshold', async () => {
      const container = await mountAt(
        TrayId.RangeReturnToEdge,
        { ...base, initial: { snapPoints: { bottom: '100px' } } },
        100
      )

      await drag(container, -45)
      release(-45)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('60px')
    })

    it('snaps to the next point when it leaves a range past the threshold', async () => {
      const container = await mountAt(
        TrayId.RangeLeave,
        { ...base, initial: { snapPoints: { bottom: '100px' } } },
        100
      )

      await drag(container, -70)
      release(-70)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('0')
    })

    it('settles at the outer end of a range dragged past', async () => {
      const container = await mountAt(
        TrayId.RangeBounds,
        {
          ...base,
          snapPoints: { bottom: [range] },
          initial: { snapPoints: { bottom: '100px' } },
        },
        100
      )

      await drag(container, 90)
      release(90)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('140px')
    })

    it('reports decimals for a range of decimals', async () => {
      const container = await mountAt(
        TrayId.RangeDecimals,
        { ...base, snapPoints: { bottom: [0, { min: 0.25, max: 0.75 }] } },
        0
      )

      await drag(container, 100)
      release(100)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('0.5')
    })

    it('rounds a resting value to whole pixels and rests on it', async () => {
      const container = await mountAt(TrayId.RangeRoundPixels, base, 0)

      await drag(container, 100.4)
      release(100.4)

      await expect
        .poll(() => read(container, TestId.DraggedBottom), { timeout: 2000 })
        .toBe('100')
      expect(read(container, TestId.Active1)).toBe('100px')
    })

    it('rounds a resting value of a decimal range to four decimals', async () => {
      const container = await mountAt(
        TrayId.RangeRoundDecimals,
        { ...base, snapPoints: { bottom: [0, { min: 0.25, max: 0.75 }] } },
        0
      )

      await drag(container, 100.123)
      release(100.123)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('0.5006')
    })

    it('reports pixels for a range that mixes units', async () => {
      const container = await mountAt(
        TrayId.RangeMixedUnits,
        { ...base, snapPoints: { bottom: [0, { min: 0.25, max: '150px' }] } },
        0
      )

      await drag(container, 100)
      release(100)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('100px')
    })

    it('a flick inside a range carries on to its end', async () => {
      const container = await mountAt(
        TrayId.RangeFlick,
        {
          ...base,
          threshold: { distance: 99999, momentum: 0.1 },
          initial: { snapPoints: { bottom: '100px' } },
        },
        100
      )

      const handle = container.querySelector<HTMLElement>(
        '.magic-tray-handle[data-side="bottom"]'
      )!
      handle.dispatchEvent(pointer('pointerdown', 200))
      await new Promise((r) => setTimeout(r, 20))
      await move(20)
      release(20)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('140px')
    })
  })

  describe('step mode', () => {
    const step: MagicTrayOptions = {
      ...base,
      snapPoints: { bottom: [0, range, '180px'] },
      snap: { mode: 'step' },
    }

    it('rests inside the range it steps into', async () => {
      const container = await mountAt(TrayId.RangeStepRest, step, 0)

      await drag(container, 100)
      release(100)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('100px')
    })

    it('lands on the near end of a range it was dragged across', async () => {
      const container = await mountAt(TrayId.RangeStepAcross, step, 0)

      await drag(container, 160)
      release(160)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('60px')
    })

    it('lands on the near end of a range it was dragged across downward', async () => {
      const container = await mountAt(
        TrayId.RangeStepAcrossDown,
        { ...step, initial: { snapPoints: { bottom: '180px' } } },
        180
      )

      await drag(container, -150)
      release(-150)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('140px')
    })

    it('steps from the start of a range to its end', async () => {
      const container = await mountAt(
        TrayId.RangeStepFromStart,
        { ...step, initial: { snapPoints: { bottom: '60px' } } },
        60
      )

      await drag(container, 100)
      release(100)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('140px')
    })

    it('steps from inside a range to its end', async () => {
      const container = await mountAt(
        TrayId.RangeStepFromInside,
        { ...step, initial: { snapPoints: { bottom: '100px' } } },
        100
      )

      await drag(container, 70)
      release(70)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('140px')
    })

    it('steps from the end of a range to the next point past it', async () => {
      const container = await mountAt(
        TrayId.RangeStepFromEnd,
        { ...step, initial: { snapPoints: { bottom: '140px' } } },
        140
      )

      await drag(container, 30)
      release(30)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('180px')
    })

    it('never skips a point to rest in a range past it', async () => {
      const container = await mountAt(
        TrayId.RangeStepNoSkip,
        {
          ...step,
          snapPoints: {
            bottom: [
              0,
              { min: '40px', max: '80px' },
              { min: '120px', max: '160px' },
            ],
          },
        },
        0
      )

      await drag(container, 140)
      release(140)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('40px')
    })
  })

  describe('drag mode', () => {
    it("'snap' follows the pointer inside a range", async () => {
      const container = await mountAt(
        TrayId.RangeDragModeSnap,
        { ...base, drag: { mode: 'snap' } },
        0
      )

      await drag(container, 100)

      expect(read(container, TestId.Active1)).toBe('100px')

      release(100)
    })

    it("'snap' holds its snap events inside a range until release", async () => {
      const container = await mountAt(
        TrayId.RangeDragModeSnapHold,
        { ...base, drag: { mode: 'snap' } },
        0
      )

      await drag(container, 100)
      await move(110)
      await move(120)
      const held = read(container, TestId.Events)

      release(120)
      await nextTick()

      expect(held).toBe('')
      expect(read(container, TestId.Events)).toBe('120px')
    })

    it("'snap' drops held events when it leaves a range for a point", async () => {
      const container = await mountAt(
        TrayId.RangeDragModeSnapLeave,
        { ...base, drag: { mode: 'snap' } },
        0
      )

      await drag(container, 100)
      await move(10)
      release(10)
      await nextTick()

      expect(read(container, TestId.Events)).toBe('0')
    })
  })

  describe('api', () => {
    it('snapTo a value inside a range rests there', async () => {
      const container = await mountAt(TrayId.RangeSnapTo, base, 0)

      click(container, TestId.SnapBtn)

      await expect
        .poll(() => Number(read(container, TestId.DraggedBottom)), {
          timeout: 2000,
        })
        .toBe(120)
    })

    it('keeps a side resting inside a range when the tray resizes', async () => {
      const container = await mountAt(
        TrayId.RangeResize,
        { ...base, initial: { snapPoints: { bottom: '100px' } } },
        100
      )

      click(container, TestId.GrowBtn)
      await new Promise((r) => setTimeout(r, 300))

      expect(read(container, TestId.DraggedBottom)).toBe('100')
      expect(read(container, TestId.Active1)).toBe('100px')
    })

    it('scales a side resting inside a decimal range when the tray resizes', async () => {
      const container = await mountAt(
        TrayId.RangeResizeDecimals,
        {
          ...base,
          snapPoints: { bottom: [0, { min: 0.25, max: 0.75 }] },
          initial: { snapPoints: { bottom: 0.5 } },
        },
        100
      )

      click(container, TestId.GrowBtn)

      await expect
        .poll(() => read(container, TestId.DraggedBottom), { timeout: 2000 })
        .toBe('120')
      expect(read(container, TestId.Active1)).toBe('0.5')
    })

    it('snapTo a point in another unit reports the configured point', async () => {
      const container = await mountAt(
        TrayId.RangeSnapToOtherUnit,
        { ...base, snapPoints: { bottom: [0, range, 0.9] } },
        0,
        '180px'
      )

      click(container, TestId.SnapBtn)

      await expect
        .poll(() => read(container, TestId.Active1), { timeout: 2000 })
        .toBe('0.9')
    })

    it('snapTo a value outside every point and range warns and stays', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const container = await mountAt(
        TrayId.RangeSnapToRejected,
        base,
        0,
        '170px'
      )

      click(container, TestId.SnapBtn)

      await vi.waitFor(() =>
        expect(
          warnSpy.mock.calls.some((call) =>
            call.some(
              (arg) =>
                typeof arg === 'string' &&
                arg.includes('neither a snap point nor inside a range')
            )
          )
        ).toBe(true)
      )
      expect(read(container, TestId.DraggedBottom)).toBe('0')
      expect(read(container, TestId.Active1)).toBe('0')
      warnSpy.mockRestore()
    })

    it('an initial value outside every point and range warns and is ignored', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const container = await mountAt(
        TrayId.RangeInitialInvalid,
        { ...base, initial: { snapPoints: { bottom: '170px' } } },
        0
      )

      expect(read(container, TestId.Active1)).toBe('0')
      expect(
        warnSpy.mock.calls.some((call) =>
          call.some(
            (arg) =>
              typeof arg === 'string' &&
              arg.includes('initial.snapPoints.bottom')
          )
        )
      ).toBe(true)
      warnSpy.mockRestore()
    })
  })

  describe('events', () => {
    it('emits afterSnap once with the resolved point', async () => {
      const container = await mountAt(TrayId.RangeAfterSnap, base, 0)

      await drag(container, 100)
      release(100)
      await new Promise((r) => setTimeout(r, 400))

      expect(read(container, TestId.Events)).toBe('100px')
    })

    it('afterSnap listeners read the settled activeSnapPoint', async () => {
      const container = await mountAt(TrayId.RangeAfterSnapState, base, 0)

      await drag(container, 100)
      release(100)
      await nextTick()

      expect(read(container, TestId.AfterSnapActive)).toBe('100px')
    })

    it('willSnapTo fires once on entering a range, not on every move', async () => {
      const container = await mountAt(TrayId.RangeWillSnapTo, base, 0)

      await drag(container, 100)
      await move(110)
      await move(120)
      const pending = read(container, TestId.WillSnapTo)

      await move(170)
      const left = read(container, TestId.WillSnapTo)

      release(170)

      expect(pending).toBe('0,100px')
      expect(left).toBe('0,100px,140px')
    })
  })

  describe('validation', () => {
    it('accepts a range end as a magnetic snap point', () => {
      expect(() =>
        mountWithApp(
          createTray(TrayId.RangeMagnetic, {
            ...base,
            magnetism: { sides: { bottom: { '60px': 'inner' } } },
          })
        )
      ).not.toThrow()
    })

    it('counts a range from 0 as fully open', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const container = await mountAt(
        TrayId.RangeOpen,
        { snapPoints: { bottom: [{ min: 0, max: '100px' }] } },
        0
      )

      expect(read(container, TestId.Active1)).toBe('0')

      const warnings = warnSpy.mock.calls.filter((call) =>
        call.some(
          (arg) => typeof arg === 'string' && arg.includes('no `0` snap point')
        )
      )
      expect(warnings.length).toBe(0)
      warnSpy.mockRestore()
    })
  })
})
