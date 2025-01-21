import { computed, nextTick, type MaybeRef } from 'vue'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

export function useMagicCommand(id: MaybeRef<string>, viewId?: string) {
  // Private methods
  const { initializeState } = useCommandState(id)

  // Public state
  const state = initializeState()
  const isActive = computed(() => state.active)

  // Public methods
  const { selectView, unselectView, selectInitialView, unselectAllViews } =
    useCommandView(id)

  async function open() {
    state.active = true
    await nextTick()
    selectInitialView()
  }

  function close() {
    state.active = false
    state.input.view = undefined
    unselectAllViews()
  }

  function selectItem(id: string) {
    if (!viewId) {
      throw new Error('viewId is required to select an item')
    }

    const { selectItem } = useCommandItem({
      instanceId: id,
      viewId: viewId,
    })

    return selectItem(id)
  }

  function unselectItem(id: string) {
    if (!viewId) {
      throw new Error('viewId is required to select an item')
    }

    const { unselectItem } = useCommandItem({
      instanceId: id,
      viewId: viewId,
    })

    return unselectItem(id)
  }

  return {
    isActive,
    open,
    close,
    selectItem,
    unselectItem,
    selectView,
    unselectView,
  }
}
