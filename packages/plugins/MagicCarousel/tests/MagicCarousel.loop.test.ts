import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createLoopedCarousel } from './test-utils'
import { CarouselId, TestId } from './enums'

describe('MagicCarousel - Loop', () => {
  it('keeps slides visually continuous across the wrap point', async () => {
    let api: ReturnType<typeof useMagicCarousel> | undefined

    render(
      defineComponent({
        components: {
          Carousel: createLoopedCarousel(
            CarouselId.LoopWrap,
            '--magic-carousel-slide-size: 120px; --magic-carousel-gap: 10px; --magic-carousel-snap-type: none;'
          ),
        },
        setup() {
          api = useMagicCarousel(CarouselId.LoopWrap)
          return {}
        },
        template: '<Carousel />',
      })
    )

    // The carousel wraps away from the start edge after mounting
    await vi.waitFor(() => {
      const track = page.getByTestId(TestId.Track).element()
      expect(api!.state.measurements.period).toBeGreaterThan(0)
      expect(track.scrollLeft).toBeGreaterThan(100)
    })

    const track = page.getByTestId(TestId.Track).element()
    const slide = page.getByTestId(TestId.Slide).elements()[0]

    const { range, period } = api!.state.measurements
    expect(range).toBeCloseTo(period + 8, 0)

    const forwardStart = slide!.getBoundingClientRect().left
    track.scrollLeft = track.scrollLeft + 6

    await vi.waitFor(() => {
      expect(track.scrollLeft).toBeLessThan(10)
    })

    expect(slide!.getBoundingClientRect().left).toBeCloseTo(forwardStart - 6, 0)

    const backwardStart = slide!.getBoundingClientRect().left
    track.scrollLeft = 2

    await vi.waitFor(() => {
      expect(track.scrollLeft).toBeGreaterThan(100)
    })

    expect(slide!.getBoundingClientRect().left).toBeCloseTo(backwardStart + 4, 0)
  })
})
