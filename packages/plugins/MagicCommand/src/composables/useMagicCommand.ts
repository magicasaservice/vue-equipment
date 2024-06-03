import { computed, type MaybeRef } from 'vue'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

export function useMagicCommand(id: MaybeRef<string>) {
  // Private methods
  const { initializeState, deleteState } = useCommandState(id)

  // Public state
  const state = initializeState()
  const isActive = computed(() => state.active)

  // Public methods
  function open() {
    state.active = true
  }

  function close() {
    state.active = false
  }

  // const { selectItem, selectLastItem } = useCommandItem(toValue(id))
  // const { selectView, selectLastView } = useCommandView()

  return {
    isActive,
    open,
    close,
    // selectItem,
    // selectLastItem,
    // selectView,
    // selectLastView,
  }
}
