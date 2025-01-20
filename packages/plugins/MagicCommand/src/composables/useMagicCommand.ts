import { computed, nextTick, type MaybeRef } from 'vue'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

export function useMagicCommand(id: MaybeRef<string>) {
  // Private methods
  const { initializeState } = useCommandState(id)

  // Public state
  const state = initializeState()
  const isActive = computed(() => state.active)

  // Public methods
  const { selectView, unselectView } = useCommandView(id)

  async function open() {
    state.active = true
    await nextTick()
    selectInitialView()
  }

  function close() {
    state.active = false
  }

  // const { selectItem, selectLastItem } = useCommandItem(toValue(id))

  return {
    isActive,
    open,
    close,
    // selectItem,
    selectView,
    unselectView,
  }
}
