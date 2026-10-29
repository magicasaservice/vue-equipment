import { computed, toValue  } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useCarouselState } from './private/useCarouselState'
import type {MaybeRef} from 'vue';

export function useMagicCarousel(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(id)
  const state = initializeState()

  const emitter = useMagicEmitter()

  // Public state
  const activeIndex = computed(() => state.activeIndex)
  const slideCount = computed(() => state.slides.length)
  const progress = computed(() => state.progress)
  const dragging = computed(() => state.dragging)
  const scrolling = computed(() => state.scrolling)
  const arrivedStart = computed(() => state.arrivedStart)
  const arrivedEnd = computed(() => state.arrivedEnd)

  // Private functions
  function findSnapIndex(direction: 'previous' | 'next') {
    const el = state.trackEl

    if (!el) {
      return null
    }

    const left = el.scrollLeft
    const positions = state.snapPositions

    if (direction === 'previous') {
      for (let i = positions.length - 1; i >= 0; i--) {
        const position = positions[i]

        if (position !== undefined && position < left - 1) {
          return i
        }
      }
    } else {
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i]

        if (position !== undefined && position > left + 1) {
          return i
        }
      }
    }

    return null
  }

  // Public functions
  function snapTo(snapPoint: number, duration?: number) {
    emitter.emit('snapTo', {
      id: toValue(id),
      snapPoint,
      duration,
    })
  }

  function previous() {
    const snapIndex = findSnapIndex('previous')

    if (snapIndex === null) {
      return
    }

    snapTo(snapIndex)
  }

  function next() {
    const snapIndex = findSnapIndex('next')

    if (snapIndex === null) {
      return
    }

    snapTo(snapIndex)
  }

  return {
    state,
    activeIndex,
    slideCount,
    progress,
    dragging,
    scrolling,
    arrivedStart,
    arrivedEnd,
    previous,
    next,
    snapTo,
  }
}

export type UseMagicCarouselReturn = ReturnType<typeof useMagicCarousel>
