import { reactive, markRaw, type MaybeRef } from 'vue'
import { useCarouselState } from './useCarouselState'
import type { CarouselSlide } from '../../types'

type InitializeSlideArgs = {
  id: string
}

export function useCarouselSlides(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  // Public functions
  function initializeSlide(args: InitializeSlideArgs) {
    const { id } = args
    let slide = state.slides.find((entry) => entry.id === id)

    if (!slide) {
      slide = reactive<CarouselSlide>({
        id: id,
        el: null,
        active: false,
        width: 0,
        loopOffset: 0,
      })

      state.slides = [...state.slides, slide]
    }

    return slide
  }

  function connectSlide(id: string, el: HTMLElement) {
    const slide = state.slides.find((entry) => entry.id === id)

    if (slide) {
      slide.el = markRaw(el)
    }
  }

  function deleteSlide(id: string) {
    state.slides = state.slides.filter((slide) => slide.id !== id)
  }

  function getSlide(id: string) {
    return state.slides.find((slide) => slide.id === id)
  }

  return {
    initializeSlide,
    connectSlide,
    deleteSlide,
    getSlide,
  }
}
