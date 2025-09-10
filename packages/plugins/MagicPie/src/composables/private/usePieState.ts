import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import type { PieState } from '../../types/index'

const pieStateStore: Ref<PieState[]> = ref([])

export function usePieState(id: MaybeRef<string>) {
  //Private functions
  function createState(id: string) {
    const state: PieState = {
      id: id,
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

  // Public functions
  function initializeState() {
    let state = pieStateStore.value.find((entry) => {
      return entry.id === id
    })

    if (!state) {
      state = addState(toValue(id))
    }
    return state
  }

  function deleteState() {
    pieStateStore.value = pieStateStore.value.filter(
      (x: PieState) => x.id !== id
    )
  }

  return {
    initializeState,
    deleteState,
  }
}
