import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, onScopeDispose } from 'vue'
import {
  useMagicEmitter
  
} from '@maas/vue-equipment/plugins/MagicEmitter'
import { createCarousel, dispatchPointer } from './test-utils'
import { CarouselId, TestId } from './enums'
import type {MagicEmitterEvents} from '@maas/vue-equipment/plugins/MagicEmitter';

type RecordedEvent = {
  name: keyof MagicEmitterEvents
  payload: MagicEmitterEvents[keyof MagicEmitterEvents]
}

const recorded: Array<RecordedEvent> = []

function recordEvent(
  name: keyof MagicEmitterEvents,
  payload: MagicEmitterEvents[keyof MagicEmitterEvents]
) {
  recorded.push({ name, payload })
}

function recordedNames() {
  return recorded.map((event) => event.name)
}

function getTrack() {
  const track = page.getByTestId(TestId.Track).element()

  if (!(track instanceof HTMLElement)) {
    throw new Error('Track element not found')
  }

  return track
}

// The emitter store is scoped to the app instance, so listeners have to be
// registered from within the rendered app
function createRecordedCarousel(carouselId: CarouselId) {
  return defineComponent({
    components: { Carousel: createCarousel(carouselId) },
    setup() {
      const emitter = useMagicEmitter()
      emitter.on('*', recordEvent)

      onScopeDispose(() => {
        emitter.off('*', recordEvent)
      })

      return {}
    },
    template: '<Carousel />',
  })
}

describe('MagicCarousel - Events', () => {
  afterEach(() => {
    recorded.length = 0
  })

  describe('snapping', () => {
    it('emits snapTo and afterSnap when a trigger is clicked', async () => {
      render(createRecordedCarousel(CarouselId.EventsSnapTo))

      const track = getTrack()

      await vi.waitFor(() => {
        expect(track.scrollWidth).toBeGreaterThan(track.clientWidth)
      })

      await page.getByTestId(TestId.TriggerNext).click()

      await vi.waitFor(
        () => {
          expect(recordedNames()).toContain('snapTo')
          expect(recordedNames()).toContain('afterSnap')
        },
        { timeout: 5000 }
      )

      const snapTo = recorded.find((event) => event.name === 'snapTo')

      expect(snapTo?.payload).toMatchObject({
        id: CarouselId.EventsSnapTo,
        snapPoint: 1,
      })
    })
  })

  describe('dragging', () => {
    it('emits beforeDrag, drag and afterDrag around a mouse drag', async () => {
      render(createRecordedCarousel(CarouselId.EventsDrag))

      const track = getTrack()

      await vi.waitFor(() => {
        expect(track.getAttribute('data-draggable')).toBe('true')
      })

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 200 })

      for (let clientX = 190; clientX >= 100; clientX -= 10) {
        dispatchPointer({ target: window, type: 'pointermove', clientX })
      }

      dispatchPointer({ target: window, type: 'pointerup', clientX: 100 })

      await vi.waitFor(() => {
        expect(recordedNames()).toContain('beforeDrag')
        expect(recordedNames()).toContain('drag')
        expect(recordedNames()).toContain('afterDrag')
      })

      const beforeDrag = recorded.find((event) => event.name === 'beforeDrag')

      expect(beforeDrag?.payload).toMatchObject({ id: CarouselId.EventsDrag })
    })
  })
})
