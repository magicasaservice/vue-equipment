import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import type { PieState } from '../../types/index'

const getPieStateStore = createStateStore<PieState[]>('MagicPie', () => [])

export function usePieState(id: MaybeRef<string>) {
  const pieStateStore = getPieStateStore()
  let scopeCounted = false

  //Private functions
  function createState(id: string) {
    const state: PieState = {
      id: id,
      refCount: 0,
      percentage: 0,
      interpolationId: undefined,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    pieStateStore.value = [...pieStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    pieStateStore.value = pieStateStore.value.filter(
      (x: PieState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState() {
    const currentId = toValue(id)
    let state = pieStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(id)
    const state = pieStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    pieStateStore,
  }
}
