import { computed, nextTick, type MaybeRef } from 'vue'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

interface SelectItemArgs {
  id: string
  viewId: string
}

interface UnselectItemArgs {
  id: string
  viewId: string
}

export function useMagicCommand(id: MaybeRef<string>) {
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

  function selectItem(args: SelectItemArgs) {
    const { id, viewId } = args

    if (!viewId) {
      throw new Error('viewId is required to select an item')
    }

    if (!id) {
      throw new Error('id is required to select an item')
    }

    const { selectItem } = useCommandItem({
      instanceId: id,
      viewId: viewId,
    })

    return selectItem(id)
  }

  function unselectItem(args: UnselectItemArgs) {
    const { id, viewId } = args

    if (!viewId) {
      throw new Error('viewId is required to select an item')
    }

    if (!id) {
      throw new Error('id is required to select an item')
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
