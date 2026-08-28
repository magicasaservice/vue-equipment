import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createCarousel, dispatchPointer, dragPointer } from './test-utils'
import { CarouselId, TestId } from './enums'

function getTrack() {
  const track = page.getByTestId(TestId.Track).element()

  if (!(track instanceof HTMLElement)) {
    throw new Error('Track element not found')
  }

  return track
}

async function renderWithApi(carouselId: CarouselId) {
  let api: ReturnType<typeof useMagicCarousel> | undefined

  render(
    defineComponent({
      components: { Carousel: createCarousel(carouselId) },
      setup() {
        api = useMagicCarousel(carouselId)
        return {}
      },
      template: '<Carousel />',
    })
  )

  const track = getTrack()

  await vi.waitFor(() => {
    expect(track.getAttribute('data-draggable')).toBe('true')
  })

  return { api: api!, track }
}

describe('MagicCarousel - Interactions', () => {
  describe('draggable', () => {
    it('arms mouse dragging once the track overflows', async () => {
      const { api } = await renderWithApi(CarouselId.InteractionDraggable)

      expect(api.state.draggable).toBe(true)
    })
  })

  describe('drag', () => {
    it('scrolls the track with momentum and settles', async () => {
      const { track } = await renderWithApi(CarouselId.InteractionDrag)

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 300 })

      await vi.waitFor(() => {
        expect(track.getAttribute('data-dragging')).toBe('true')
      })

      await dragPointer({ target: window, from: 300, to: 60, step: 30 })

      await vi.waitFor(() => {
        expect(track.getAttribute('data-scrolling')).toBe('true')
        expect(track.scrollLeft).toBeGreaterThan(0)
      })

      dispatchPointer({ target: window, type: 'pointerup', clientX: 60 })

      await vi.waitFor(
        () => {
          expect(track.getAttribute('data-dragging')).toBeNull()
          expect(track.getAttribute('data-scrolling')).toBeNull()
          expect(track.scrollLeft).toBeGreaterThan(50)
        },
        { timeout: 5000 }
      )
    })
  })

  describe('rubberband', () => {
    it('overshoots past the start and relaxes back', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberband
      )

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 100 })

      await dragPointer({ target: window, from: 100, to: 400, step: 30 })

      await vi.waitFor(() => {
        expect(api.state.rubberbandOffset).toBeGreaterThan(0)
      })

      dispatchPointer({ target: window, type: 'pointerup', clientX: 400 })

      await vi.waitFor(
        () => {
          expect(track.getAttribute('data-scrolling')).toBeNull()
          expect(api.state.rubberbandOffset).toBe(0)
          expect(track.scrollLeft).toBeLessThan(2)
        },
        { timeout: 5000 }
      )
    })
  })
})
