import { computed, toValue, watch  } from 'vue'
import { useEventListener, useDebounceFn } from '@vueuse/core'
import { clampValue } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useCarouselState } from './useCarouselState'
import type {MaybeRef} from 'vue';

export function useCarouselScroll(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  const emitter = useMagicEmitter()

  const mappedTrackEl = computed(() => state.trackEl)

  // Private functions
  function track() {
    const el = state.trackEl

    if (!el) {
      return
    }

    const { range, direction, period } = state.measurements
    const logicalPosition = el.scrollLeft * direction

    state.progress =
      range > 0 ? clampValue(Math.abs(el.scrollLeft) / range, 0, 1) : 0

    if (state.options.loop) {
      state.arrivedStart = false
      state.arrivedEnd = false
    } else {
      state.arrivedStart = logicalPosition <= 1
      state.arrivedEnd = logicalPosition >= range - 1
    }

    let activeIndex = -1
    let nearestDistance = Number.POSITIVE_INFINITY

    for (const [index, position] of state.snapPositions.entries()) {
      let distance = Math.abs(position - el.scrollLeft)

      // Snap positions repeat once per period when looping
      if (state.options.loop && period > 0) {
        distance = Math.min(
          distance,
          Math.abs(position - period - el.scrollLeft),
          Math.abs(position + period - el.scrollLeft)
        )
      }

      if (distance < nearestDistance) {
        nearestDistance = distance
        activeIndex = index
      }
    }

    if (activeIndex !== state.activeIndex) {
      state.activeIndex = activeIndex

      for (const [index, slide] of state.slides.entries()) {
        slide.active = index === activeIndex
      }

      emitter.emit('beforeSnap', {
        id: toValue(instanceId),
        snapPoint: activeIndex,
      })
    }
  }

  function settle() {
    if (state.dragging || state.scrolling) {
      return
    }

    emitter.emit('scrollEnd', toValue(instanceId))
    emitter.emit('afterSnap', {
      id: toValue(instanceId),
      snapPoint: state.activeIndex,
    })
  }

  const debouncedSettle = useDebounceFn(settle, 150)

  function onScroll() {
    track()

    if (typeof window !== 'undefined' && !('onscrollend' in window)) {
      debouncedSettle()
    }
  }

  useEventListener(mappedTrackEl, 'scroll', onScroll, { passive: true })
  useEventListener(mappedTrackEl, 'scrollend', settle, { passive: true })

  watch(
    () => [state.trackEl, state.snapPositions],
    () => track()
  )

  return {
    track,
  }
}
