import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { CookieState, MagicCookieOptions } from '../../types/index'

const cookieStateStore: Ref<CookieState[]> = ref([])

export function useCookieState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: CookieState = {
      id: id,
      items: [],
      options: { ...defaultOptions },
      viewActive: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    cookieStateStore.value = [...cookieStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState(options?: MagicCookieOptions) {
    let state = cookieStateStore.value.find((entry) => {
      return entry.id === toValue(instanceId)
    })

    if (!state) {
      state = addState(toValue(instanceId))
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      state.options = mappedOptions
    }

    return state
  }

  function deleteState() {
    cookieStateStore.value = cookieStateStore.value.filter(
      (x: CookieState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    cookieStateStore,
  }
}
