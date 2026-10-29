import { computed, watch  } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { useCarouselState } from './useCarouselState'
import type {MaybeRef} from 'vue';

// The looped track's ::after spacer guarantees at least 2 × this threshold
// of scroll runway past the period (see MagicCarouselTrack)
export const wrapThreshold = 4

export function useCarouselLoop(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  const mappedTrackEl = computed(() => state.trackEl)
  const mappedLoop = computed(() => state.options.loop)

  // Private functions
  function offsetSlides(args: {
    startIndex: number
    endIndex: number
    threshold: number
    isEnd: boolean
  }) {
    const { startIndex, endIndex, threshold, isEnd } = args
    const { period, gap } = state.measurements

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
    const el = state.trackEl

    if (!el || !mappedLoop.value || !state.slides.length) {
      return
    }

    const { width, gap, paddingStart, range, period } = state.measurements

    if (period <= 0) {
      return
    }

    const scrollStart = x ?? el.scrollLeft
    const contentEnd = paddingStart + period - gap

    const distanceToStartEdge = paddingStart - scrollStart
    const distanceToEndEdge = scrollStart + width - contentEnd

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

    const left =
      scrollStart > range - wrapThreshold
        ? scrollStart - period
        : scrollStart < wrapThreshold
          ? scrollStart + period
          : null

    if (left === null) {
      return
    }

    state.scrollingInternally = true
    el.scrollTo({ left, behavior: 'instant' })
  }

  useEventListener(
    mappedTrackEl,
    'scroll',
    () => {
      if (!state.scrolling && !state.dragging) {
        syncLoop()
      }
    },
    { passive: true }
  )

  useResizeObserver(mappedTrackEl, () => syncLoop())

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
