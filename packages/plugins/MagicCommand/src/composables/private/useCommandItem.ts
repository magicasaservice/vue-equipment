import { reactive } from 'vue'
import { useCommandView } from './useCommandView'

import type { MaybeRef } from 'vue'
import type { CommandItem } from '../../types/index'

type ItemArgs = {
  viewId: string
  id: string
}

type InitializeItemArgs = ItemArgs & Pick<CommandItem, 'disabled'>
type CreateItemArgs = Pick<CommandItem, 'id' | 'disabled'>
type AddItemArgs = ItemArgs & Pick<CommandItem, 'disabled'>

type SelectSiblingArgs = {
  viewId: string
  loop?: boolean
}

export function useCommandItem(instanceId: MaybeRef<string>) {
  const { getView } = useCommandView(instanceId)

  // Private functions
  function createItem(args: CreateItemArgs) {
    const { id, disabled } = args

    const item: CommandItem = {
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
  function getActiveItem(viewId: string) {
    return getView(viewId)?.items.find((item) => item.active)
  }

  function initializeItem(args: InitializeItemArgs) {
    const { viewId, id } = args
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
    const item = getItem(args)

    if (item) {
      item.active = true

      // Deactivate all siblings
      unselectSiblings(args)
    }
  }

  function selectNextItem(args: SelectSiblingArgs) {
    const { viewId, loop = false } = args
    const view = getView(viewId)
    const index = view?.items.findIndex(
      (item) => item.id === getActiveItem(viewId)?.id
    )

    if (index !== undefined && view) {
      const nextItem =
        view.items[index + 1] ?? (loop ? view.items[0] : undefined)
      if (nextItem) {
        selectItem({ viewId, id: nextItem.id })
      }
    }
  }

  function selectPrevItem(args: SelectSiblingArgs) {
    const { viewId, loop = false } = args
    const view = getView(viewId)
    const index = view?.items.findIndex(
      (item) => item.id === getActiveItem(viewId)?.id
    )

    if (index !== undefined && view) {
      const prevItem =
        view.items[index - 1] ??
        (loop ? view.items[view.items.length - 1] : undefined)
      if (prevItem) {
        selectItem({ viewId, id: prevItem.id })
      }
    }
  }

  function unselectItem(args: ItemArgs) {
    const item = getItem(args)

    if (item) {
      item.active = false
    }
  }

  return {
    getActiveItem,
    initializeItem,
    deleteItem,
    getItem,
    selectItem,
    selectNextItem,
    selectPrevItem,
    unselectItem,
  }
}
