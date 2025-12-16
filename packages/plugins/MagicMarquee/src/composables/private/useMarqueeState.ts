import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MarqueeState, MagicMarqueeOptions } from '../../types/index'

const getMarqueeStateStore = createStateStore<MarqueeState[]>(() => [])

export function useMarqueeState(instanceId: MaybeRef<string>) {
  const marqueeStateStore = getMarqueeStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: MarqueeState = {
      id: id,
      refCount: 0,
      options: { ...defaultOptions },
      playing: true,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    marqueeStateStore.value = [...marqueeStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    marqueeStateStore.value = marqueeStateStore.value.filter(
      (x: MarqueeState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicMarqueeOptions) {
    const currentId = toValue(instanceId)
    let state = marqueeStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      state.options = mappedOptions
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(instanceId)
    const state = marqueeStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    marqueeStateStore,
  }
}
