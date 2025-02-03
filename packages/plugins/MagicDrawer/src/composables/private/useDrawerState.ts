import { ref, reactive, toRefs, toValue, type Ref, type MaybeRef } from 'vue'
import type { DrawerState } from '../../types/index'

const drawerStateStore: Ref<DrawerState[]> = ref([])

export function useDrawerState(id: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: DrawerState = {
      id: id,
      active: false,
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
    const state = createState(id)
    drawerStateStore.value = [...drawerStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState() {
    let state = drawerStateStore.value.find((entry) => {
      return entry.id === id
    })

    if (!state) state = addState(toValue(id))
    return toRefs(state)
  }

  function deleteState() {
    drawerStateStore.value = drawerStateStore.value.filter((x) => x.id !== id)
  }

  return {
    initializeState,
    deleteState,
    drawerStateStore,
  }
}
