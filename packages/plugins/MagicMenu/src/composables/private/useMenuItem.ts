import { reactive, type MaybeRef } from 'vue'
import { usePointer, watchOnce } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'

import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'
import type { MenuItem } from '../../types/index'

type UseMenuItemArgs = {
  instanceId: MaybeRef<string>
  viewId: string
}

type InitializeItemArgs = Pick<MenuItem, 'id' | 'disabled'>
type CreateItemArgs = Pick<MenuItem, 'id' | 'disabled'>
type AddItemArgs = Pick<MenuItem, 'id' | 'disabled'>

export function useMenuItem(args: UseMenuItemArgs) {
  const { instanceId, viewId } = args

  const { throwError } = useMagicError({
    prefix: 'MagicMenu',
    source: 'MagicMenu',
  })
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { getView, unselectDescendingViews } = useMenuView(instanceId)
  const view = getView(viewId)

  if (!view) {
    throwError({
      message: `View ${viewId} not found`,
      errorCode: 'view_id_not_found',
    })
  }

  // Private functions
  function createItem(args: CreateItemArgs) {
    const { id, disabled } = args

    const item: MenuItem = {
      id: id,
      active: false,
      disabled: disabled,
    }

    return reactive(item)
  }

  function addItem(args: AddItemArgs) {
    const item = createItem(args)

    if (view?.items) {
      view.items = [...view.items, item]
    }

    return item
  }

  function unselectSiblings(id: string) {
    return view?.items
      .filter((item) => item.id !== id)
      .forEach((item) => (item.active = false))
  }

  // Public functions
  function initializeItem(args: InitializeItemArgs) {
    const { id } = args
    const item = getItem(id) ?? addItem(args)

    return item
  }

  function deleteItem(id: string) {
    if (!view?.items) return
    view.items = view.items.filter((x) => x.id !== id)
  }

  function getItem(id: string) {
    return view?.items.find((item) => {
      return item.id === id
    })
  }

  function selectItem(id: string, disablePointer?: boolean) {
    const item = getItem(id)

    if (item) {
      item.active = true

      // Deactivate all siblings and descending views
      unselectSiblings(id)
      unselectDescendingViews(viewId)

      // Set view in focus
      if (view) {
        state.input.view = view.id
      }

      if (disablePointer) {
        const { x, y } = usePointer()
        state.input.disabled = [...state.input.disabled, 'pointer'] // Disable pointer

        watchOnce([x, y], () => {
          state.input.disabled = state.input.disabled.filter(
            (x) => x !== 'pointer'
          ) // Enable pointer
        })
      }
    }
  }

  function unselectItem(id: string) {
    const item = getItem(id)

    if (item) {
      item.active = false
    }
  }

  return {
    initializeItem,
    deleteItem,
    getItem,
    selectItem,
    unselectItem,
  }
}
