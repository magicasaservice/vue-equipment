import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent } from 'vue'
import { useMagicCarousel } from '../src/composables/useMagicCarousel'
import { createCarousel } from './test-utils'
import { CarouselId, TestId } from './enums'

function getView() {
  const view = page.getByTestId(TestId.View).element()

  if (!(view instanceof HTMLElement)) {
    throw new Error('View element not found')
  }

  return view
}

describe('MagicCarousel - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicCarousel> | undefined

      render(
        defineComponent({
          setup() {
            api = useMagicCarousel(CarouselId.ApiShape)
            return {}
          },
          template: '<div>test</div>',
        })
      )

      expect(typeof api!.previous).toBe('function')
      expect(typeof api!.next).toBe('function')
      expect(typeof api!.snapTo).toBe('function')
      expect(api!.activeIndex.value).toBe(-1)
      expect(api!.slideCount.value).toBe(0)
      expect(api!.progress.value).toBe(0)
      expect(api!.dragging.value).toBe(false)
      expect(api!.arrivedStart.value).toBe(true)
      expect(api!.arrivedEnd.value).toBe(false)
    })
  })

  describe('slide count', () => {
    it('reflects the number of rendered slides', async () => {
      render(createCarousel(CarouselId.ApiSlideCount))

      await vi.waitFor(() => {
        expect(page.getByTestId(TestId.SlideCount).element().textContent).toBe(
          '6'
        )
      })
    })
  })

  describe('snapTo', () => {
    it('snaps to the given slide', async () => {
      render(createCarousel(CarouselId.ApiSnapTo))

      const view = getView()

      await vi.waitFor(() => {
        expect(view.scrollWidth).toBeGreaterThan(view.clientWidth)
      })

      await page.getByTestId(TestId.SnapTo).click()

      await vi.waitFor(() => {
        expect(view.scrollLeft).toBeGreaterThan(150)
      })
    })
  })

  describe('next and previous', () => {
    it('scrolls forwards and backwards between snap positions', async () => {
      render(createCarousel(CarouselId.ApiNext))

      const view = getView()

      await vi.waitFor(() => {
        expect(view.scrollWidth).toBeGreaterThan(view.clientWidth)
      })

      await page.getByTestId(TestId.Next).click()

      await vi.waitFor(() => {
        expect(view.scrollLeft).toBeGreaterThan(50)
      })

      const scrolledTo = view.scrollLeft

      await page.getByTestId(TestId.Previous).click()

      await vi.waitFor(() => {
        expect(view.scrollLeft).toBeLessThan(scrolledTo)
      })
    })
  })
})
