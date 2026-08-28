import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createCarousel, createLoopedCarousel } from './test-utils'
import { CarouselId, TestId } from './enums'

describe('MagicCarousel - Options', () => {
  describe('defaults', () => {
    it('initializes with the default options', () => {
      let api: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          components: { Carousel: createCarousel(CarouselId.OptDefaults) },
          setup() {
            api = useMagicCarousel(CarouselId.OptDefaults)
            return {}
          },
          template: '<Carousel />',
        })
      )

      expect(api!.state.options.loop).toBe(false)
      expect(api!.state.options.disabled).toBe(false)
      expect(api!.state.options.threshold.lock).toBe(10)
      expect(api!.state.options.animation.snap.duration).toBe(300)
      expect(typeof api!.state.options.animation.snap.easing).toBe('function')
      expect(api!.state.options.animation.momentum.friction).toBe(0.72)
      expect(api!.state.options.animation.momentum.damping).toBe(0.12)
    })
  })

  describe('loop', () => {
    it('sets data-loop on the track', async () => {
      render(createCarousel(CarouselId.OptLoop, { loop: true }))

      await vi.waitFor(() => {
        const track = page.getByTestId(TestId.Track).element()
        expect(track.getAttribute('data-loop')).toBe('true')
      })
    })

    it('sizes slides in container query units relative to the provider', async () => {
      render(
        createLoopedCarousel(
          CarouselId.OptLoopRelative,
          '--magic-carousel-slide-size: 50cqi; --magic-carousel-gap: 0px;'
        )
      )

      await vi.waitFor(() => {
        const slides = page.getByTestId(TestId.Slide).elements()
        expect(slides[0]?.getBoundingClientRect().width).toBeCloseTo(150, 1)
      })
    })

    it('computes the slides per view size from the provider width', async () => {
      render(
        createLoopedCarousel(
          CarouselId.OptLoopPerView,
          '--magic-carousel-slides-per-view: 3; --magic-carousel-gap: 0px;'
        )
      )

      await vi.waitFor(() => {
        const slides = page.getByTestId(TestId.Slide).elements()
        expect(slides[0]?.getBoundingClientRect().width).toBeCloseTo(100, 1)
      })
    })
  })

  describe('merging', () => {
    it('merges custom options over the defaults', () => {
      let api: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          components: {
            Carousel: createCarousel(CarouselId.OptMerge, {
              animation: { momentum: { friction: 0.5 } },
            }),
          },
          setup() {
            api = useMagicCarousel(CarouselId.OptMerge)
            return {}
          },
          template: '<Carousel />',
        })
      )

      expect(api!.state.options.animation.momentum.friction).toBe(0.5)
      expect(api!.state.options.animation.momentum.damping).toBe(0.12)
      expect(api!.state.options.animation.snap.duration).toBe(300)
      expect(api!.state.options.loop).toBe(false)
    })
  })
})
