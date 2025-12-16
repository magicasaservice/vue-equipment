import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import type { ModalState } from '../../types/index'

// Initialize here to ensure single store per app instance
const getModalStateStore = createStateStore<ModalState[]>(() => [])

export function useModalState(id: MaybeRef<string>) {
  const modalStateStore = getModalStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: ModalState = {
      id,
      refCount: 0,
      active: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    modalStateStore.value = [...modalStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    modalStateStore.value = modalStateStore.value.filter(
      (x) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState() {
    const currentId = toValue(id)
    let state = modalStateStore.value.find((entry) => entry.id === currentId)

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
    const state = modalStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    modalStateStore,
  }
}
