import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createCarousel } from './test-utils'
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
    it('sets data-loop on the view', async () => {
      render(createCarousel(CarouselId.OptLoop, { loop: true }))

      await vi.waitFor(() => {
        const view = page.getByTestId(TestId.View).element()
        expect(view.getAttribute('data-loop')).toBe('true')
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
