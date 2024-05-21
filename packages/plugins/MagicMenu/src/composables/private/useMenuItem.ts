import { reactive, computed, type MaybeRef } from 'vue'
import type { MagicMenuItem } from '../../types/index'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'

type UseMenuItemArgs = {
  instanceId: MaybeRef<string>
  viewId: string
}

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
  function createItem(id: string) {
    const item: MagicMenuItem = {
      id: id,
      active: false,
    }

    return reactive(item)
  }

  function addItem(id: string) {
    const item = createItem(id)

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
  function initializeItem(id: string) {
    const instance = getItem(id)

    if (!instance) {
      const item = addItem(id)
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

      // Deactivate all non tree views
      unselectSiblings(id)
      unselectNonTreeViews(viewId)

      // Set view in focus
      if (view) {
        state.viewInFocus = view.id
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
