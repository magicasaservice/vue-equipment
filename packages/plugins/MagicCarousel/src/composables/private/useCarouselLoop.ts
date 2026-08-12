import { computed, watch, type MaybeRef } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { useCarouselState } from './useCarouselState'

const wrapThreshold = 4

export function useCarouselLoop(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  const mappedViewEl = computed(() => state.viewEl)
  const mappedLoop = computed(() => state.options.loop)

  // Private functions
  function offsetSlides(args: {
    startIndex: number
    endIndex: number
    threshold: number
    isEnd: boolean
  }) {
    const { startIndex, endIndex, threshold, isEnd } = args
    const { range, gap } = state.measurements

    // The seamless period includes one more gap than the scroll range
    const period = range + gap

    const step = isEnd ? -1 : 1
    const baseOffset = isEnd ? -period : period

    let offset = 0

    for (let i = startIndex; isEnd ? i >= endIndex : i < endIndex; i += step) {
      const slide = state.slides[i]

      if (!slide) {
        continue
      }

      slide.loopOffset = offset > threshold ? 0 : baseOffset
      offset += slide.width + gap
    }
  }

  // Public functions
  function syncLoop(x?: number) {
    const el = state.viewEl

    if (!el || !mappedLoop.value || !state.slides.length) {
      return
    }

    const { scrollWidth, width, paddingStart, paddingEnd } = state.measurements

    const scrollStart = x ?? el.scrollLeft
    const distanceToStartEdge = paddingStart - scrollStart
    const distanceToEndEdge = scrollStart - (scrollWidth - width - paddingEnd)

    offsetSlides({
      startIndex: state.slides.length - 1,
      endIndex: state.slides.length / 2,
      threshold: distanceToStartEdge,
      isEnd: true,
    })

    offsetSlides({
      startIndex: 0,
      endIndex: state.slides.length / 2,
      threshold: distanceToEndEdge,
      isEnd: false,
    })

    if (state.dragging || state.scrolling) {
      return
    }

    const end = scrollWidth - width - wrapThreshold
    const left =
      scrollStart > end
        ? wrapThreshold
        : scrollStart < wrapThreshold
          ? end
          : null

    if (left === null) {
      return
    }

    state.scrollingInternally = true
    el.scrollTo({ left, behavior: 'instant' })
  }

  useEventListener(
    mappedViewEl,
    'scroll',
    () => {
      if (!state.scrolling && !state.dragging) {
        syncLoop()
      }
    },
    { passive: true }
  )

  useResizeObserver(mappedViewEl, () => syncLoop())

  watch(mappedLoop, (value) => {
    if (value) {
      syncLoop()
    } else {
      for (const slide of state.slides) {
        slide.loopOffset = 0
      }
    }
  })

  return {
    syncLoop,
  }
}
