import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MarqueeState, MagicMarqueeOptions } from '../../types/index'

const marqueeStateStore: Ref<MarqueeState[]> = ref([])

export function useMarqueeState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: MarqueeState = {
      id: id,
      options: { ...defaultOptions },
      playing: true,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    marqueeStateStore.value = [...marqueeStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState(options?: MagicMarqueeOptions) {
    let instance = marqueeStateStore.value.find((instance) => {
      return instance.id === toValue(instanceId)
    })

    if (!instance) {
      instance = addState(toValue(instanceId))
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      instance.options = mappedOptions
    }

    return instance
  }

  function deleteState() {
    marqueeStateStore.value = marqueeStateStore.value.filter(
      (x: MarqueeState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    marqueeStateStore,
  }
}
