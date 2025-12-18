import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'

import type {
  ToastState,
  MagicToastOptions,
  ToastDefaultOptions,
} from '../../types/index'

const getToastStateStore = createStateStore<ToastState[]>(
  'MagicToast',
  () => []
)

export function useToastState(instanceId: MaybeRef<string>) {
  const toastStateStore = getToastStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: ToastState = {
      id: id,
      refCount: 0,
      options: { ...defaultOptions },
      views: [],
      expanded: false,
      animating: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    toastStateStore.value = [...toastStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    toastStateStore.value = toastStateStore.value.filter(
      (x: ToastState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicToastOptions) {
    const currentId = toValue(instanceId)
    let state = toastStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions) as ToastDefaultOptions
      state.options = mappedOptions

      // Set initial state for expanded
      state.expanded = mappedOptions.initial.expanded
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(instanceId)
    const state = toastStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    toastStateStore,
  }
}
