import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import '@maas/vue-equipment/utils/css/keyframes/zoom-in.css'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import {
  createCarousel,
  createLoopedCarousel,
  dispatchPointer,
  dragPointer,
} from './test-utils'
import { CarouselId, TestId } from './enums'
import type { Component } from 'vue'

// An ancestor that scales the carousel on screen
function createScaled(carousel: Component, style: string) {
  return defineComponent({
    components: { Carousel: carousel },
    template: `<div style="${style}"><Carousel /></div>`,
  })
}

function getTrack() {
  const track = page.getByTestId(TestId.Track).element()

  if (!(track instanceof HTMLElement)) {
    throw new Error('Track element not found')
  }

  return track
}

async function mounted() {
  const track = getTrack()

  await vi.waitFor(() => {
    expect(track.getAttribute('data-draggable')).toBe('true')
  })

  return track
}

async function step(trigger: TestId, activeIndex: string) {
  await page.getByTestId(trigger).click()

  await expect
    .element(page.getByTestId(TestId.ActiveIndex))
    .toHaveTextContent(activeIndex)

  await vi.waitFor(() => {
    expect(getTrack().getAttribute('data-snapping')).toBeNull()
  })
}

async function settle() {
  for (let frame = 0; frame < 12; frame++) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
}

describe('MagicCarousel - Edge Cases', () => {
  describe('scaled ancestor', () => {
    it('steps back after mounting inside a zoom-in entrance', async () => {
      render(
        createScaled(
          createCarousel(CarouselId.EdgeEntrance),
          'animation: zoom-in 300ms both'
        )
      )

      await mounted()

      // The entrance takes 300ms
      await new Promise((resolve) => setTimeout(resolve, 400))

      await step(TestId.Next, '1')
      await step(TestId.Next, '2')
      await step(TestId.Previous, '1')
    })

    it('advances under a zoomed ancestor', async () => {
      render(createScaled(createCarousel(CarouselId.EdgeZoom), 'zoom: 1.1'))

      await mounted()

      await step(TestId.Next, '1')
      await step(TestId.Next, '2')
      await step(TestId.Next, '3')
    })

    it('measures one round of a looped track in its own pixels', async () => {
      let api: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          components: {
            Carousel: createScaled(
              createLoopedCarousel(
                CarouselId.EdgeLoop,
                '--magic-carousel-slide-size: 120px; --magic-carousel-gap: 10px;'
              ),
              'transform: scale(0.8)'
            ),
          },
          setup() {
            api = useMagicCarousel(CarouselId.EdgeLoop)
            return {}
          },
          template: '<Carousel />',
        })
      )

      // Six slides of 120px, each followed by a gap of 10px
      await vi.waitFor(() => {
        expect(api!.state.measurements.period).toBeCloseTo(780, 1)
      })
    })

    it('moves the content as far as the pointer', async () => {
      render(
        createScaled(
          createCarousel(CarouselId.EdgeDrag),
          'transform: scale(0.8)'
        )
      )

      const track = await mounted()
      const slide = page.getByTestId(TestId.Slide).elements()[1]!

      dispatchPointer({ target: track, type: 'pointerdown', clientX: 250 })

      await dragPointer({ target: window, from: 250, to: 190, step: 10 })
      await settle()

      const halfway = slide.getBoundingClientRect().left

      await dragPointer({ target: window, from: 190, to: 130, step: 10 })
      await settle()

      const travelled = halfway - slide.getBoundingClientRect().left

      dispatchPointer({ target: window, type: 'pointerup', clientX: 130 })

      expect(Math.abs(travelled - 60)).toBeLessThan(1)
    })
  })
})
