import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MenuState, MagicMenuOptions } from '../../types/index'

const menuStateStore: Ref<MenuState[]> = ref([])

export function useMenuState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: MenuState = {
      id: id,
      options: { ...defaultOptions },
      views: [],
      active: false,
      input: {
        type: 'pointer',
        disabled: [],
        view: undefined,
      },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    menuStateStore.value = [...menuStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState(options?: MagicMenuOptions) {
    let state = menuStateStore.value.find((entry) => {
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
    menuStateStore.value = menuStateStore.value.filter(
      (x: MenuState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    menuStateStore,
  }
}
