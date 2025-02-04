import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'

import type {
  ToastState,
  MagicToastOptions,
  ToastDefaultOptions,
} from '../../types/index'

const toastStateStore: Ref<ToastState[]> = ref([])

export function useToastState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: ToastState = {
      id: id,
      options: { ...defaultOptions },
      views: [],
      expanded: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    toastStateStore.value = [...toastStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState(options?: MagicToastOptions) {
    let state = toastStateStore.value.find((entry) => {
      return entry.id === toValue(instanceId)
    })

    if (!state) {
      state = addState(toValue(instanceId))
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions) as ToastDefaultOptions
      state.options = mappedOptions

      // Set initial state for expanded
      state.expanded = mappedOptions.initial.expanded ?? false
    }

    return state
  }

  function deleteState() {
    toastStateStore.value = toastStateStore.value.filter(
      (x: ToastState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    toastStateStore,
  }
}
