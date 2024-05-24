import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MagicMenuState, MagicMenuOptions } from '../../types/index'

const menuStateStore: Ref<MagicMenuState[]> = ref([])

export function useMenuState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: MagicMenuState = {
      id: id,
      options: defaultOptions,
      views: [],
      active: false,
      input: {
        type: 'pointer',
        disabled: [],
        view: '',
      },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    menuStateStore.value = [...menuStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState(options?: MagicMenuOptions) {
    let instance = menuStateStore.value.find((instance) => {
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
    menuStateStore.value = menuStateStore.value.filter(
      (x: MagicMenuState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    menuStateStore,
  }
}
