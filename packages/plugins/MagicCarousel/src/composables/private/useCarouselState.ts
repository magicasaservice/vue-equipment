import { reactive, toValue, onScopeDispose  } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type {MaybeRef} from 'vue';
import type { CarouselState, MagicCarouselOptions } from '../../types/index'

const getCarouselStateStore = createStateStore<Array<CarouselState>>(
  'MagicCarousel',
  () => []
)

export function useCarouselState(instanceId: MaybeRef<string>) {
  const carouselStateStore = getCarouselStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: CarouselState = {
      id: id,
      refCount: 0,
      options: defu({}, defaultOptions),
      viewEl: null,
      slides: [],
      snapPositions: [],
      measurements: {
        scrollWidth: 0,
        width: 0,
        range: 0,
        gap: 0,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        direction: 1,
      },
      activeIndex: -1,
      dragging: false,
      scrolling: false,
      scrollingInternally: false,
      snapping: false,
      interpolationId: null,
      draggable: false,
      hasSnap: true,
      snapMandatory: true,
      arrivedStart: true,
      arrivedEnd: false,
      progress: 0,
      overshoot: 0,
      rubberbandOffset: 0,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    carouselStateStore.value = [...carouselStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    carouselStateStore.value = carouselStateStore.value.filter(
      (x: CarouselState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicCarouselOptions) {
    const currentId = toValue(instanceId)
    let state = carouselStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      state.options = defu(options, defaultOptions)
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(instanceId)
    const state = carouselStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    carouselStateStore,
  }
}
