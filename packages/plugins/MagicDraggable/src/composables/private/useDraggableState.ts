import { ref, reactive, toRefs, toValue, type Ref, type MaybeRef } from 'vue'
import type { MagicDraggableState } from '../../types/index'

const drawerStateStore: Ref<MagicDraggableState[]> = ref([])

export function useDraggableState(id: MaybeRef<string>) {
  //Private functions
  function createState(id: string) {
    const state: MagicDraggableState = {
      id: id,
      dragStart: undefined,
      dragging: false,
      interpolateTo: undefined,
      originX: 0,
      originY: 0,
      lastDraggedX: 0,
      lastDraggedY: 0,
      intermediateDraggedX: 0,
      intermediateDraggedY: 0,
      draggedX: 0,
      draggedY: 0,
      elRect: undefined,
      wrapperRect: undefined,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    drawerStateStore.value = [...drawerStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState() {
    let instance = drawerStateStore.value.find((instance) => {
      return instance.id === id
    })

    if (!instance) instance = addState(toValue(id))
    return toRefs(instance)
  }

  function deleteState() {
    drawerStateStore.value = drawerStateStore.value.filter(
      (x: MagicDraggableState) => x.id !== id
    )
  }

  return {
    initializeState,
    deleteState,
  }
}
