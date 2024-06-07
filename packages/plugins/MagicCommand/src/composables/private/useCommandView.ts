import { reactive, nextTick, toValue, type MaybeRef } from 'vue'
import { useCommandState } from './useCommandState'

import type { CommandView } from '../../types/index'

type CreateViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>
type AddViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>
type FindViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>

export function useCommandView(instanceId: MaybeRef<string>) {
  const { initializeState } = useCommandState(instanceId)
  const state = initializeState()

  // Private functions
  function createView(args: CreateViewArgs) {
    const { id, parent, initial } = args

    if (parent.views.length === 0) {
      parent.views.push(toValue(instanceId))
    }

    const view: CommandView = {
      id: id,
      parent: parent,
      initial: initial,
      active: false,
      children: {
        trigger: undefined,
        content: undefined,
      },
      items: [],
    }

    return reactive(view)
  }

  function addView(args: AddViewArgs) {
    const view = createView(args)
    state.views = [...state.views, view]

    return view
  }

  // Public functions
  function initializeView(args: FindViewArgs) {
    const { id } = args
    let instance = getView(id)

    if (!instance) instance = addView(args)
    return instance
  }

  function deleteView(id: string) {
    state.views = state.views?.filter((view) => view.id !== id)
  }

  function getView(id: string) {
    return state.views?.find((view) => {
      return view.id === id
    })
  }

  function selectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = true
    }
  }

  function selectInitialView() {
    const initialView = state.views?.find((view) => view.initial)

    if (initialView) {
      initialView.active = true
    }
  }

  function unselectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = false
    }
  }

  function unselectAllViews() {
    state.views?.forEach((view) => {
      view.active = false
    })
  }

  function sortItems(viewId: string) {
    const parent = document.querySelector(`[data-id="${viewId}-content"]`)
    const view = getView(viewId)

    const elements: HTMLElement[] = Array.from(
      parent?.querySelectorAll('.magic-menu-item') ?? []
    )

    function getIndex(id: string) {
      return elements.findIndex((el) => el.dataset.id === id)
    }

    view?.items?.sort((a, b) => getIndex(a.id) - getIndex(b.id))
  }

  return {
    initializeView,
    deleteView,
    getView,
    selectView,
    selectInitialView,
    unselectView,
    unselectAllViews,
    sortItems,
  }
}
