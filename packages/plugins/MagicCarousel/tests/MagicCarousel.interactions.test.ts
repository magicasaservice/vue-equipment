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

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

async function renderWithApi(carouselId: CarouselId, style = '') {
  let api: ReturnType<typeof useMagicCarousel> | undefined

  render(
    defineComponent({
      components: { Carousel: createCarousel(carouselId) },
      setup() {
        api = useMagicCarousel(carouselId)
        return {}
      },
      template: `<Carousel style="${style}" />`,
    })
  )

  const track = getTrack()

  await vi.waitFor(() => {
    expect(track.getAttribute('data-draggable')).toBe('true')
  })

  return { api: api!, track }
}

// Pulls the track past the start, lets go and presses again
// once the band has relaxed halfway, returns the offset it is caught at
async function catchBand(
  api: ReturnType<typeof useMagicCarousel>,
  track: HTMLElement
) {
  dispatchPointer({ target: track, type: 'pointerdown', clientX: 100 })

  await dragPointer({ target: window, from: 100, to: 400, step: 30 })

  await vi.waitFor(() => {
    expect(api.state.rubberbandOffset).toBeGreaterThan(0)
  })

  const held = api.state.rubberbandOffset

  dispatchPointer({ target: window, type: 'pointerup', clientX: 400 })

  while (api.state.rubberbandOffset > held / 2) {
    await nextFrame()
  }

  const caught = api.state.rubberbandOffset

  dispatchPointer({ target: track, type: 'pointerdown', clientX: 200 })

  return caught
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

    it('relaxes back as fast from a far drag as from a near one', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberbandRelax
      )

      // The time the band takes to lose half of the offset it was held at
      async function relax(distance: number) {
        dispatchPointer({ target: track, type: 'pointerdown', clientX: 100 })

        await dragPointer({
          target: window,
          from: 100,
          to: 100 + distance,
          step: distance / 10,
        })

        await vi.waitFor(() => {
          expect(api.state.rubberbandOffset).toBeGreaterThan(0)
        })

        const held = api.state.rubberbandOffset
        const released = performance.now()

        dispatchPointer({
          target: window,
          type: 'pointerup',
          clientX: 100 + distance,
        })

        while (api.state.rubberbandOffset > held / 2) {
          await nextFrame()
        }

        const elapsed = performance.now() - released

        await vi.waitFor(
          () => {
            expect(track.getAttribute('data-scrolling')).toBeNull()
          },
          { timeout: 5000 }
        )

        return elapsed
      }

      const near = await relax(60)
      const far = await relax(1500)

      expect(far).toBeLessThan(near * 2)
    })

    it('clips the pulled track to the box it rests in', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberbandWindow
      )

      const rest = track.getBoundingClientRect()

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 100 })

      await dragPointer({ target: window, from: 100, to: 400, step: 30 })

      await vi.waitFor(() => {
        expect(api.state.rubberbandOffset).toBeGreaterThan(0)
      })

      const pulled = track.getBoundingClientRect()
      const insets = getComputedStyle(track)
        .clipPath.match(/-?[\d.]+(?=px)/g)
        ?.map(Number)

      expect(pulled.right).toBeGreaterThan(rest.right)
      expect(insets).toHaveLength(4)
      expect(pulled.right - insets![1]!).toBeCloseTo(rest.right, 1)
      expect(insets![3]).toBe(0)

      dispatchPointer({ target: window, type: 'pointerup', clientX: 400 })
    })

    it('rests on the start when flung past it without snapping', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberbandFling,
        '--magic-carousel-snap-type: none'
      )

      track.scrollLeft = 100

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 50 })

      await dragPointer({ target: window, from: 50, to: 110, step: 30 })

      dispatchPointer({ target: window, type: 'pointerup', clientX: 110 })

      let overshoot = 0

      while (track.getAttribute('data-scrolling')) {
        overshoot = Math.max(overshoot, Math.abs(api.state.rubberbandOffset))
        await nextFrame()
      }

      expect(overshoot).toBe(0)
      expect(track.scrollLeft).toBeLessThan(2)
    })

    it('holds a relaxing band where it is caught', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberbandCatch
      )

      const caught = await catchBand(api, track)

      await nextFrame()
      await nextFrame()

      expect(caught).toBeGreaterThan(0)
      expect(api.state.rubberbandOffset).toBeCloseTo(caught, 2)

      dispatchPointer({ target: window, type: 'pointerup', clientX: 200 })
    })

    it('lets a caught band relax again without a drag', async () => {
      const { api, track } = await renderWithApi(
        CarouselId.InteractionRubberbandLetGo
      )

      const caught = await catchBand(api, track)

      dispatchPointer({ target: window, type: 'pointerup', clientX: 200 })

      await nextFrame()
      await nextFrame()

      expect(api.state.rubberbandOffset).toBeGreaterThan(caught / 2)
      expect(api.state.rubberbandOffset).toBeLessThan(caught)

      await vi.waitFor(
        () => {
          expect(track.getAttribute('data-scrolling')).toBeNull()
          expect(api.state.rubberbandOffset).toBe(0)
        },
        { timeout: 5000 }
      )
    })
  })
})
