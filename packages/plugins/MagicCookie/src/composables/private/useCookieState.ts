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
      options: defaultOptions,
      viewActive: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    cookieStateStore.value = [...cookieStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState(options?: MagicCookieOptions) {
    let instance = cookieStateStore.value.find((instance) => {
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
