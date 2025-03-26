import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import type { DraggableState } from '../../types/index'

const draggableStateStore: Ref<DraggableState[]> = ref([])

export function useDraggableState(id: MaybeRef<string>) {
  //Private functions
  function createState(id: string) {
    const state: DraggableState = {
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
    const state = createState(id)
    draggableStateStore.value = [...draggableStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState() {
    let state = draggableStateStore.value.find((entry) => {
      return entry.id === id
    })

    if (!state) state = addState(toValue(id))
    return state
  }

  function deleteState() {
    draggableStateStore.value = draggableStateStore.value.filter(
      (x: DraggableState) => x.id !== id
    )
  }

  return {
    initializeState,
    deleteState,
  }
}
