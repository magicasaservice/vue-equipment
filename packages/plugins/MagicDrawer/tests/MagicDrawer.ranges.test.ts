import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  reactive,
} from 'vue'
import MagicDrawerProvider from '../src/components/MagicDrawerProvider.vue'
import MagicDrawerTeleport from '../src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from '../src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from '../src/components/MagicDrawerContent.vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { useMagicEmitter } from '../../MagicEmitter'
import { DrawerId, TestId } from './enums'

import type { MagicEmitterEvents } from '../../MagicEmitter'
import type {
  MagicDrawerOptions,
  MagicDrawerSnapPoint,
} from '../src/types/index'

// A 300px drawer that can rest anywhere from 100px to 250px open, or fully
// open. Measured as offsets from fully open, the range spans 50 to 200.
const range = { min: '100px', max: '250px' } as const

const base: MagicDrawerOptions = {
  snapPoints: [range, 1],
  threshold: { distance: 8, momentum: 99999 },
}

function createDrawer(
  id: DrawerId,
  options: MagicDrawerOptions,
  snapTarget: MagicDrawerSnapPoint = '150px'
) {
  return defineComponent({
    components: {
      MagicDrawerProvider,
      MagicDrawerTeleport,
      MagicDrawerBackdrop,
      MagicDrawerContent,
    },
    setup() {
      const { open, snapTo, isActive, activeSnapPoint, state } =
        useMagicDrawer(id)
      const emitter = useMagicEmitter()
      const dragged = computed(() => state.draggedY)
      const willSnapTo = reactive<Array<MagicDrawerSnapPoint>>([])

      function onWillSnapTo(payload: MagicEmitterEvents['willSnapTo']) {
        if (payload.id === id) {
          willSnapTo.push(payload.snapPoint)
        }
      }

      emitter.on('willSnapTo', onWillSnapTo)

      onBeforeUnmount(() => {
        emitter.off('willSnapTo', onWillSnapTo)
      })

      return {
        options,
        open,
        snap: () => snapTo(snapTarget),
        isActive,
        activeSnapPoint,
        dragged,
        willSnapTo,
      }
    },
    template: `
      <MagicDrawerProvider id="${id}" :options="options">
        <span data-test-id="${TestId.IsActive}">{{ isActive }}</span>
        <span data-test-id="${TestId.Active1}">{{ activeSnapPoint }}</span>
        <span data-test-id="${TestId.Dragged}">{{ dragged }}</span>
        <span data-test-id="${TestId.WillSnapTo}">{{ willSnapTo.join(',') }}</span>
        <button data-test-id="${TestId.Trigger}" @click="open">Open</button>
        <button data-test-id="${TestId.SnapBtn}" @click="snap">Snap</button>
        <MagicDrawerTeleport>
          <MagicDrawerBackdrop />
          <MagicDrawerContent style="--magic-drawer-height: 300px">
            <div style="height: 300px; width: 100%;">Content</div>
          </MagicDrawerContent>
        </MagicDrawerTeleport>
      </MagicDrawerProvider>
    `,
  })
}

function pointer(type: string, clientY: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    clientX: 200,
    clientY,
    screenX: 200,
    screenY: clientY,
  })
}

function read(testId: TestId) {
  return document.querySelector(`[data-test-id="${testId}"]`)!.textContent
}

function click(testId: TestId) {
  document.querySelector<HTMLElement>(`[data-test-id="${testId}"]`)!.click()
}

async function open(screen: ReturnType<typeof render>) {
  await screen.getByTestId(TestId.Trigger).click()
  await nextTick()
  await nextTick()
  await new Promise((r) => setTimeout(r, 350))
}

// Drags the drawer `distance` pixels toward closed
async function drag(distance: number) {
  document
    .querySelector('.magic-drawer-content__drag')!
    .dispatchEvent(pointer('pointerdown', 300))
  await nextTick()
  await move(distance)
}

// Moves the pointer of a running drag to `distance` pixels from its start
async function move(distance: number) {
  document.dispatchEvent(pointer('pointermove', 300 + distance))
  await nextTick()
}

function release(distance: number) {
  document.dispatchEvent(pointer('pointerup', 300 + distance))
}

describe('MagicDrawer - Ranges', () => {
  describe('release', () => {
    it('rests where it was let go inside a range', async () => {
      const screen = render(createDrawer(DrawerId.RangeRestInside, base))
      await open(screen)

      await drag(120)
      release(120)

      await expect.poll(() => read(TestId.Active1)).toBe('180px')
      expect(read(TestId.Dragged)).toBe('120')
    })

    it('rounds a resting value to whole pixels and rests on it', async () => {
      const screen = render(createDrawer(DrawerId.RangeRound, base))
      await open(screen)

      await drag(120.4)
      release(120.4)

      await expect.poll(() => read(TestId.Dragged)).toBe('120')
      expect(read(TestId.Active1)).toBe('180px')
    })

    it('snaps to the nearer end of a range it fell short of', async () => {
      const screen = render(createDrawer(DrawerId.RangeSnapToEnd, base))
      await open(screen)

      await drag(30)
      release(30)

      await expect.poll(() => read(TestId.Active1)).toBe('250px')
    })

    it('closes once released past a range that reaches the closed end', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeClose, {
          ...base,
          snapPoints: [{ min: 0, max: '250px' }, 1],
        })
      )
      await open(screen)

      await drag(330)
      release(330)

      await expect.poll(() => read(TestId.IsActive)).toBe('false')
    })

    it('rests near the closed end of a range, outside the distance threshold', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeNearClose, {
          ...base,
          snapPoints: [{ min: 0, max: '250px' }, 1],
        })
      )
      await open(screen)

      await drag(280)
      release(280)

      await expect.poll(() => read(TestId.Active1)).toBe('20px')
      expect(read(TestId.IsActive)).toBe('true')
    })

    it('closes once dragged within the distance threshold of the closed end', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeCloseThreshold, {
          snapPoints: [{ min: 0, max: '250px' }, 1],
          threshold: { distance: 30, momentum: 99999 },
        })
      )
      await open(screen)

      await drag(280)
      release(280)

      await expect.poll(() => read(TestId.IsActive)).toBe('false')
    })

    it('a tap within the threshold of the closed end leaves the drawer open', async () => {
      const screen = render(
        createDrawer(
          DrawerId.RangeTapNearClose,
          {
            snapPoints: [{ min: 0, max: '250px' }, 1],
            threshold: { distance: 30, momentum: 99999 },
          },
          '20px'
        )
      )
      await open(screen)
      click(TestId.SnapBtn)
      await expect.poll(() => read(TestId.Dragged)).toBe('280')

      await drag(0)
      release(0)
      await new Promise((r) => setTimeout(r, 100))

      expect(read(TestId.IsActive)).toBe('true')
    })

    it('a drag away from the closed end leaves the drawer open', async () => {
      const screen = render(
        createDrawer(
          DrawerId.RangeAwayFromClose,
          {
            snapPoints: [{ min: 0, max: '250px' }, 1],
            threshold: { distance: 30, momentum: 99999 },
          },
          '10px'
        )
      )
      await open(screen)
      click(TestId.SnapBtn)
      await expect.poll(() => read(TestId.Dragged)).toBe('290')

      await drag(-10)
      release(-10)

      await expect.poll(() => read(TestId.Active1)).toBe('20px')
      expect(read(TestId.IsActive)).toBe('true')
    })

    it("steps to the near end of a range dragged across in 'step' mode", async () => {
      const screen = render(
        createDrawer(DrawerId.RangeStep, { ...base, snap: { mode: 'step' } })
      )
      await open(screen)

      await drag(260)
      release(260)

      await expect.poll(() => read(TestId.Active1)).toBe('250px')
    })

    it('a flick inside a range carries on to its end', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeFlick, {
          ...base,
          threshold: { distance: 99999, momentum: 0.1 },
          initial: { snapPoint: '180px' },
        })
      )
      await open(screen)

      document
        .querySelector('.magic-drawer-content__drag')!
        .dispatchEvent(pointer('pointerdown', 300))
      await new Promise((r) => setTimeout(r, 20))
      await move(20)
      release(20)

      await expect.poll(() => read(TestId.Active1)).toBe('100px')
    })

    it('a flick inside a range without momentum rests where it was let go', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeFlickNoMomentum, {
          snapPoints: [{ ...range, momentum: false }, 1],
          threshold: { distance: 99999, momentum: 0.1 },
          initial: { snapPoint: '180px' },
        })
      )
      await open(screen)

      document
        .querySelector('.magic-drawer-content__drag')!
        .dispatchEvent(pointer('pointerdown', 300))
      await new Promise((r) => setTimeout(r, 20))
      await move(20)
      release(20)

      await expect.poll(() => read(TestId.Active1)).toBe('160px')
    })
  })

  describe('api', () => {
    it('opens at an initial value inside a range', async () => {
      const screen = render(
        createDrawer(DrawerId.RangeInitial, {
          ...base,
          initial: { snapPoint: '180px' },
        })
      )
      await open(screen)

      await expect.poll(() => read(TestId.Dragged)).toBe('120')
      expect(read(TestId.Active1)).toBe('180px')
    })

    it('snapTo a value inside a range rests there', async () => {
      const screen = render(createDrawer(DrawerId.RangeSnapTo, base))
      await open(screen)

      click(TestId.SnapBtn)

      await expect.poll(() => read(TestId.Dragged)).toBe('150')
      expect(read(TestId.Active1)).toBe('150px')
    })
  })

  describe('events', () => {
    it('willSnapTo fires once on entering a range, not on every move', async () => {
      const screen = render(createDrawer(DrawerId.RangeWillSnapTo, base))
      await open(screen)

      await drag(120)
      await move(130)
      await move(140)
      const pending = read(TestId.WillSnapTo)

      release(140)

      expect(pending).toBe('1,180px')
    })
  })
})
