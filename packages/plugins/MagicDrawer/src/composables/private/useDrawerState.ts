import { ref, reactive, toRefs, toValue, type Ref, type MaybeRef } from 'vue'
import type { DrawerState } from '../../types/index'

const drawerStateStore: Ref<DrawerState[]> = ref([])

export function useDrawerState(id: MaybeRef<string>) {
  function createState(id: string) {
    const state: DrawerState = {
      id: id,
      dragStart: undefined,
      dragging: false,
      wheeling: false,
      shouldClose: false,
      interpolateTo: undefined,
      originX: 0,
      originY: 0,
      lastDraggedX: 0,
      lastDraggedY: 0,
      draggedX: 0,
      draggedY: 0,
      relDirectionY: 'absolute',
      relDirectionX: 'absolute',
      absDirectionY: undefined,
      absDirectionX: undefined,
      elRect: undefined,
      wrapperRect: undefined,
      progress: {
        x: 0,
        y: 0,
      },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    drawerStateStore.value = [...drawerStateStore.value, instance]

    return instance
  }

  function initializeState() {
    let instance = drawerStateStore.value.find((instance) => {
      return instance.id === id
    })

    if (!instance) instance = addState(toValue(id))
    return toRefs(instance)
  }

  function deleteState() {
    drawerStateStore.value = drawerStateStore.value.filter(
      (x: DrawerState) => x.id !== id
    )
  }

  return {
    addState,
    initializeState,
    deleteState,
  }
}
