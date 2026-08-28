import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createCarousel } from './test-utils'
import { CarouselId, TestId } from './enums'

describe('MagicCarousel - State', () => {
  describe('shared state', () => {
    it('shares state between composable calls with the same id', async () => {
      let outerApi: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          components: { Carousel: createCarousel(CarouselId.StateShared) },
          setup() {
            outerApi = useMagicCarousel(CarouselId.StateShared)
            return {}
          },
          template: '<Carousel />',
        })
      )

      await vi.waitFor(() => {
        expect(outerApi!.slideCount.value).toBe(6)
      })
    })
  })

  describe('active index', () => {
    it('activates the last slide once the track is scrolled to the end', async () => {
      // Slides narrower than the track leave the trailing ones aligned
      // past the maximum scroll
      render(createCarousel(CarouselId.StateActiveEnd, {}, 6, '35%'))

      const track = page.getByTestId(TestId.Track).element()
      const activeIndex = page.getByTestId(TestId.ActiveIndex).element()
      const slides = page.getByTestId(TestId.Slide).elements()

      await vi.waitFor(() => {
        expect(track.scrollWidth).toBeGreaterThan(track.clientWidth)
      })

      track.scrollLeft = track.scrollWidth

      await vi.waitFor(() => {
        expect(activeIndex.textContent).toBe(String(slides.length - 1))
        expect(slides[slides.length - 1]?.getAttribute('data-active')).toBe(
          'true'
        )
      })
    })
  })

  describe('independent state', () => {
    it('keeps state of different instances separate', async () => {
      let api1: ReturnType<typeof useMagicCarousel> | undefined
      let api2: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          components: { Carousel: createCarousel(CarouselId.StateInd1, {}, 4) },
          setup() {
            api1 = useMagicCarousel(CarouselId.StateInd1)
            api2 = useMagicCarousel(CarouselId.StateInd2)
            return {}
          },
          template: '<Carousel />',
        })
      )

      await vi.waitFor(() => {
        expect(api1!.slideCount.value).toBe(4)
      })

      expect(api2!.slideCount.value).toBe(0)
      expect(api1!.state).not.toBe(api2!.state)
    })
  })
})
