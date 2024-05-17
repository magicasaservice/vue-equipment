import { ref, reactive, toRefs, toValue, type Ref, type MaybeRef } from 'vue'
import type { MagicMenuState } from '../../types/index'

const menuStateStore: Ref<MagicMenuState[]> = ref([])

export function useMenuState(instanceId: MaybeRef<string>) {
  function createState(id: string) {
    const state: MagicMenuState = {
      id: id,
      views: [],
      items: [],
      active: false,
      mode: 'mouse',
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    menuStateStore.value = [...menuStateStore.value, instance]

    return instance
  }

  function initializeState() {
    let instance = menuStateStore.value.find((instance) => {
      return instance.id === toValue(instanceId)
    })

    if (!instance) instance = addState(toValue(instanceId))
    return toRefs(instance)
  }

  function deleteState() {
    menuStateStore.value = menuStateStore.value.filter(
      (x: MagicMenuState) => x.id !== toValue(instanceId)
    )
  }

  return {
    addState,
    initializeState,
    deleteState,
    menuStateStore,
  }
}
