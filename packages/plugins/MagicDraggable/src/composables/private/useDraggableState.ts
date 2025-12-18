import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import type { DraggableState } from '../../types/index'

const getDraggableStateStore = createStateStore<DraggableState[]>(
  'MagicDraggable',
  () => []
)

export function useDraggableState(id: MaybeRef<string>) {
  const draggableStateStore = getDraggableStateStore()
  let scopeCounted = false

  //Private functions
  function createState(id: string) {
    const state: DraggableState = {
      id: id,
      refCount: 0,
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
      activeSnapPoint: undefined,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    draggableStateStore.value = [...draggableStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    draggableStateStore.value = draggableStateStore.value.filter(
      (x: DraggableState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState() {
    const currentId = toValue(id)
    let state = draggableStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(id)
    const state = draggableStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    draggableStateStore,
  }
}
