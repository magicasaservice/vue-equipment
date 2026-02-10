import { computed, nextTick, type MaybeRef } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useCommandState } from './private/useCommandState'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

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
  const activeView = computed(() => state.views.find((view) => view.active))

  // Public functions
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
      throwError({
        message: 'viewId is required to select an item',
        errorCode: 'view_id_required',
      })
    }

    if (!id) {
      throwError({
        message: 'id is required to select an item',
        errorCode: 'id_required',
      })
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
      throwError({
        message: 'viewId is required to select an item',
        errorCode: 'view_id_required',
      })
    }

    if (!id) {
      throwError({
        message: 'id is required to select an item',
        errorCode: 'id_required',
      })
    }

    const { unselectItem } = useCommandItem({
      instanceId: id,
      viewId: viewId,
    })

    return unselectItem(id)
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
