import { reactive, toRefs, toValue, type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import type { MagicMenuItem } from '../../types/index'
import { useMenuUtils } from './useMenuUtils'

type CreateItemArgs = {
  id: string
  parentTree: string[]
}

type AddItemArgs = {
  id: string
  parentTree: string[]
}

type FindItemArgs = {
  id: string
  parentTree: string[]
}

export function useMenuItem(instanceId: MaybeRef<string>) {
  const { findState } = useMenuState(instanceId)
  const state = findState()

  // Private functions
  const { arraysAreEqual } = useMenuUtils()

  function createItem(args: CreateItemArgs) {
    const { id, parentTree } = args

    const item: MagicMenuItem = {
      id: id,
      parent: parentTree,
      active: false,
    }

    return reactive(item)
  }

  function addItem(args: AddItemArgs) {
    const item = createItem(args)
    state.items.value = [...state.items.value, item]

    return item
  }

  // Public functions
  function initializeItem(args: FindItemArgs) {
    const { id } = args

    let instance = getItem(id)

    if (!instance) instance = addItem(args)
    return toRefs(instance)
  }

  function deleteItem(id: string) {
    state.items.value = state.items.value.filter(
      (x: MagicMenuItem) => x.id !== id
    )
  }

  function getItem(id: string) {
    return state.items.value.find((item) => {
      return item.id === id
    })
  }

  function getActiveItem() {
    return [...state.items.value].reverse().find((item) => {
      return item.active
    })
  }

  function getViewItems(viewId: string) {
    return state.items.value.filter((item) => {
      return item.parent[item.parent.length - 1] === viewId
    })
  }

  function getItemSiblings(id: string, includeSelf = true) {
    const instance = getItem(id)

    const siblings = state.items.value.filter((item) => {
      if (!instance?.parent) return false

      return includeSelf
        ? arraysAreEqual(instance?.parent, item.parent)
        : arraysAreEqual(instance?.parent, item.parent) && item.id !== id
    })

    return siblings
  }

  function getNextItem(id: string) {
    const siblings = getItemSiblings(id)
    const index = siblings.findIndex((item) => {
      return item.id === id
    })

    return siblings[index + 1]
  }

  function getPreviousItem(id: string) {
    const siblings = getItemSiblings(id)
    const index = siblings.findIndex((item) => {
      return item.id === id
    })

    return siblings[index - 1]
  }

  function selectItem(id: string) {
    // Activate item
    const instance = getItem(id)

    if (instance) {
      instance.active = true
    }

    // Deactivate sibling items in the same branch
    const siblings = getItemSiblings(id, false)

    siblings.forEach((sibling) => {
      sibling.active = false
    })
  }

  function selectNextItem(id: string) {
    const nextItem = getNextItem(id)

    if (nextItem) {
      selectItem(nextItem.id)
    }
  }

  function selectPreviousItem(id: string) {
    const previousItem = getPreviousItem(id)

    if (previousItem) {
      selectItem(previousItem.id)
    }
  }

  function unselectAllItems() {
    state.items.value.forEach((item) => {
      item.active = false
    })
  }

  return {
    initializeItem,
    deleteItem,
    getItem,
    getActiveItem,
    getViewItems,
    getNextItem,
    getPreviousItem,
    selectPreviousItem,
    selectItem,
    selectNextItem,
    unselectAllItems,
  }
}
