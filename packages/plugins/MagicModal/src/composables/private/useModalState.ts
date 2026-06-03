import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createDefu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { ModalState, MagicModalOptions } from '../../types/index'

const getModalStateStore = createStateStore<ModalState[]>(
  'MagicModal',
  () => []
)

export function useModalState(id: MaybeRef<string>) {
  const modalStateStore = getModalStateStore()
  let scopeCounted = false

  const customDefu = createDefu((obj, key, value) => {
    if (key === 'close') {
      obj[key] = value
      return true
    }
  })

  // Private functions
  function createState(id: string) {
    const state: ModalState = {
      id,
      refCount: 0,
      active: false,
      options: { ...defaultOptions },
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
  function initializeState(options?: MagicModalOptions) {
    const currentId = toValue(id)
    let state = modalStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      const mappedOptions = customDefu(options, defaultOptions)
      state.options = mappedOptions
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
  }, true)

  return {
    initializeState,
    modalStateStore,
  }
}
