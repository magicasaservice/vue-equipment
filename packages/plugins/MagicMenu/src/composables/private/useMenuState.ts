import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import type { MagicMenuState } from '../../types/index'

const menuStateStore: Ref<MagicMenuState[]> = ref([])

export function useMenuState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: MagicMenuState = {
      id: id,
      views: [],
      active: false,
      mode: 'mouse',
      viewInFocus: '',
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    menuStateStore.value = [...menuStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState() {
    let instance = menuStateStore.value.find((instance) => {
      return instance.id === toValue(instanceId)
    })

    if (!instance) instance = addState(toValue(instanceId))
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
