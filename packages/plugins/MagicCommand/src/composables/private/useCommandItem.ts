import { reactive, computed, type MaybeRef } from 'vue'
import { usePointer, watchOnce } from '@vueuse/core'

import { useCommandView } from './useCommandView'
import { useCommandState } from './useCommandState'
import type { CommandItem } from '../../types/index'

type UseCommandItemArgs = {
  instanceId: MaybeRef<string>
  viewId: string
}

type InitializeItemArgs = Pick<CommandItem, 'id' | 'disabled'>
type CreateItemArgs = Pick<CommandItem, 'id' | 'disabled'>
type AddItemArgs = Pick<CommandItem, 'id' | 'disabled'>

export function useCommandItem(args: UseCommandItemArgs) {
  const { instanceId, viewId } = args

  const { initializeState } = useCommandState(instanceId)
  const state = initializeState()

  const { getView } = useCommandView(instanceId)
  const view = getView(viewId)

  // if (!view) {
  //   throw new Error(`View ${viewId} not found`)
  // }

  // Public state
  const activeItem = computed(() => view?.items.find((item) => item.active))

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

      // Deactivate all siblings
      unselectSiblings(id)
    }
  }

  function selectNextItem(loop: boolean = false) {
    const index = view?.items.findIndex(
      (item) => item.id === activeItem.value?.id
    )

    if (index !== undefined) {
      const hasNext = view?.items[index + 1] !== undefined

      if (hasNext) {
        selectItem(view?.items[index + 1].id)
      } else if (view && loop) {
        selectItem(view.items[0].id)
      }
    }
  }

  function selectPrevItem(loop: boolean = false) {
    const index = view?.items.findIndex(
      (item) => item.id === activeItem.value?.id
    )

    if (index !== undefined) {
      const hasPrev = view?.items[index - 1] !== undefined

      if (hasPrev) {
        selectItem(view?.items[index - 1].id)
      } else if (view && loop) {
        selectItem(view.items[view.items.length - 1].id)
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
    activeItem,
    initializeItem,
    deleteItem,
    getItem,
    selectItem,
    selectNextItem,
    selectPrevItem,
    unselectItem,
  }
}
