import { reactive, type MaybeRef } from 'vue'
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

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { getView, unselectUnrelatedViews } = useMenuView(instanceId)
  const view = getView(viewId)

  if (!view) {
    throw new Error(`View ${viewId} not found`)
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
      unselectUnrelatedViews(viewId)

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
