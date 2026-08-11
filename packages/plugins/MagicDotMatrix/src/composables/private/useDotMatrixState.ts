import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { DotMatrixState, MagicDotMatrixOptions } from '../../types/index'

const getDotMatrixStateStore = createStateStore<Array<DotMatrixState>>(
  'MagicDotMatrix',
  () => []
)

export function useDotMatrixState(instanceId: MaybeRef<string>) {
  const dotMatrixStateStore = getDotMatrixStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: DotMatrixState = {
      id: id,
      refCount: 0,
      options: { ...defaultOptions },
      playing: true,
      frame: 0,
      loops: 0,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    dotMatrixStateStore.value = [...dotMatrixStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    dotMatrixStateStore.value = dotMatrixStateStore.value.filter(
      (x: DotMatrixState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicDotMatrixOptions) {
    const currentId = toValue(instanceId)
    let state = dotMatrixStateStore.value.find(
      (entry) => entry.id === currentId
    )

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
    const state = dotMatrixStateStore.value.find(
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
    dotMatrixStateStore,
  }
}
