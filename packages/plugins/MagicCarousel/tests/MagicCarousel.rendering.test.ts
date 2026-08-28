import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { createCarousel } from './test-utils'
import { CarouselId, TestId } from './enums'

describe('MagicCarousel - Rendering', () => {
  describe('provider', () => {
    it('renders with its data-id', () => {
      render(createCarousel(CarouselId.RenderProvider))

      const provider = document.querySelector(
        `[data-id="${CarouselId.RenderProvider}"]`
      )

      expect(provider).not.toBeNull()
      expect(provider?.classList.contains('magic-carousel-provider')).toBe(true)
    })
  })

  describe('slides', () => {
    it('renders all slides with their content', async () => {
      render(createCarousel(CarouselId.RenderSlides))

      const slides = page.getByTestId(TestId.Slide).elements()

      expect(slides.length).toBe(6)
      expect(slides[0]?.textContent).toContain('1')
    })

    it('marks the first slide as active initially', async () => {
      render(createCarousel(CarouselId.RenderActive))

      await vi.waitFor(() => {
        const slides = page.getByTestId(TestId.Slide).elements()
        expect(slides[0]?.getAttribute('data-active')).toBe('true')
        expect(slides[1]?.getAttribute('data-active')).toBeNull()
      })
    })
  })

  describe('triggers', () => {
    it('renders buttons and disables previous at the start', async () => {
      render(createCarousel(CarouselId.RenderTrigger))

      const previous = page.getByTestId(TestId.TriggerPrevious).element()
      const next = page.getByTestId(TestId.TriggerNext).element()

      expect(previous.tagName).toBe('BUTTON')
      expect(previous.getAttribute('data-action')).toBe('previous')
      expect(next.getAttribute('data-action')).toBe('next')

      await vi.waitFor(() => {
        expect(previous.getAttribute('data-disabled')).toBe('true')
        expect(next.getAttribute('data-disabled')).toBeNull()
      })
    })
  })
})
