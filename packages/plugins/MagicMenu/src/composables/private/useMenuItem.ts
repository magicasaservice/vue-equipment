import { reactive } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'

import type { MaybeRef } from 'vue'

import type { MenuItem } from '../../types/index'

type ItemArgs = {
  viewId: string
  id: string
}

type InitializeItemArgs = ItemArgs & Pick<MenuItem, 'disabled'>
type CreateItemArgs = Pick<MenuItem, 'id' | 'disabled'>
type AddItemArgs = ItemArgs & Pick<MenuItem, 'disabled'>

export function useMenuItem(instanceId: MaybeRef<string>) {
  const { throwError } = useMagicError({
    prefix: 'MagicMenu',
    source: 'useMenuItem',
  })
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { getView, unselectDescendingViews } = useMenuView(instanceId)

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
    const { viewId, id, disabled } = args
    const item = createItem({ id, disabled })
    const view = getView(viewId)

    if (view?.items) {
      view.items = [...view.items, item]
    }

    return item
  }

  function unselectSiblings(args: ItemArgs) {
    const { viewId, id } = args

    return getView(viewId)
      ?.items.filter((item) => item.id !== id)
      .forEach((item) => (item.active = false))
  }

  // Public functions
  function initializeItem(args: InitializeItemArgs) {
    const { viewId, id } = args

    if (!getView(viewId)) {
      throwError({
        message: `View ${viewId} not found`,
        errorCode: 'view_id_not_found',
      })
    }

    const item = getItem({ viewId, id }) ?? addItem(args)

    return item
  }

  function deleteItem(args: ItemArgs) {
    const { viewId, id } = args
    const view = getView(viewId)

    if (!view?.items) {
      return
    }
    view.items = view.items.filter((x) => x.id !== id)
  }

  function getItem(args: ItemArgs) {
    const { viewId, id } = args

    return getView(viewId)?.items.find((item) => {
      return item.id === id
    })
  }

  function selectItem(args: ItemArgs) {
    const { viewId, id } = args
    const item = getItem({ viewId, id })

    if (item) {
      item.active = true

      // Deactivate all siblings and descending views
      unselectSiblings({ viewId, id })
      unselectDescendingViews(viewId)

      // Set view in focus
      state.input.view = viewId
    }
  }

  function unselectItem(args: ItemArgs) {
    const item = getItem(args)

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
