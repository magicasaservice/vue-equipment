import { computed, nextTick } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

import type { MaybeRef } from 'vue'

const { throwError } = useMagicError({
  prefix: 'MagicCommand',
  source: 'useMagicCommand',
})

interface SelectItemArgs {
  id: string
  viewId: string
}

interface UnselectItemArgs {
  id: string
  viewId: string
}

export function useMagicCommand(id: MaybeRef<string>) {
  // Private functions
  const { initializeState } = useCommandState(id)

  // Public state
  const state = initializeState()
  const isActive = computed(() => state.active)
  const activeView = computed(() => state.views.find((view) => view.active)?.id)

  // Public functions
  const { selectView, unselectView, selectInitialView, unselectAllViews } =
    useCommandView(id)

  const { selectItem: selectViewItem, unselectItem: unselectViewItem } =
    useCommandItem(id)

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
    const { id: itemId, viewId } = args

    if (!viewId) {
      throwError({
        message: 'viewId is required to select an item',
        errorCode: 'view_id_required',
      })
    }

    if (!itemId) {
      throwError({
        message: 'id is required to select an item',
        errorCode: 'id_required',
      })
    }

    return selectViewItem({ viewId, id: itemId })
  }

  function unselectItem(args: UnselectItemArgs) {
    const { id: itemId, viewId } = args

    if (!viewId) {
      throwError({
        message: 'viewId is required to select an item',
        errorCode: 'view_id_required',
      })
    }

    if (!itemId) {
      throwError({
        message: 'id is required to select an item',
        errorCode: 'id_required',
      })
    }

    return unselectViewItem({ viewId, id: itemId })
  }

  return {
    isActive,
    activeView,
    open,
    close,
    selectItem,
    unselectItem,
    selectView,
    unselectView,
  }
}
