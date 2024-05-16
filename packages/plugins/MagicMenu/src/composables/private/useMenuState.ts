import { ref, reactive, toRefs, toValue, type Ref, type MaybeRef } from 'vue'
import type { MagicMenuState } from '../../types/index'

const menuStateStore: Ref<MagicMenuState[]> = ref([])

export function useMenuState(id: MaybeRef<string>) {
  function createState(id: string) {
    const state: MagicMenuState = {
      id: id,
      views: [],
      items: [],
      active: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    menuStateStore.value = [...menuStateStore.value, instance]

    return instance
  }

  function findState() {
    let instance = menuStateStore.value.find((instance) => {
      return instance.id === id
    })

    if (!instance) instance = addState(toValue(id))
    return toRefs(instance)
  }

  function deleteState() {
    menuStateStore.value = menuStateStore.value.filter(
      (x: MagicMenuState) => x.id !== id
    )
  }

  return {
    addState,
    findState,
    deleteState,
    menuStateStore,
  }
}
