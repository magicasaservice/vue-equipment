import { reactive, type MaybeRef } from 'vue'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'
import type { MagicMenuItem } from '../../types/index'

type UseMenuItemArgs = {
  instanceId: MaybeRef<string>
  viewId: string
}

type InitializeItemArgs = Pick<MagicMenuItem, 'id' | 'disabled'>
type CreateItemArgs = Pick<MagicMenuItem, 'id' | 'disabled'>
type AddItemArgs = Pick<MagicMenuItem, 'id' | 'disabled'>

export function useMenuItem(args: UseMenuItemArgs) {
  const { instanceId, viewId } = args

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { getView, unselectNonTreeViews } = useMenuView(instanceId)
  const view = getView(viewId)

  if (!view) {
    throw new Error(`View ${viewId} not found`)
  }

  // Private functions
  function createItem(args: CreateItemArgs) {
    const { id, disabled } = args

    const item: MagicMenuItem = {
      id: id,
      active: false,
      disabled: disabled,
    }

    return reactive(item)
  }

  function addItem(args: AddItemArgs) {
    const item = createItem(args)

    if (view?.items) {
      view.items = [...view?.items, item]
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
    const instance = getItem(id)

    if (!instance) {
      const item = addItem(args)
      return item
    }

    return instance
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

  function selectItem(id: string) {
    const instance = getItem(id)

    if (instance) {
      instance.active = true

      // Deactivate all siblings and non tree views
      unselectSiblings(id)
      unselectNonTreeViews(viewId)

      // Set view in focus
      if (view) {
        state.input.view = view.id
      }
    }
  }

  function unselectItem(id: string) {
    const instance = getItem(id)

    if (instance) {
      instance.active = false
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
