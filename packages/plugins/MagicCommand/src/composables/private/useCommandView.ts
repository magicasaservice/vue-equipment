import { reactive, watch, computed, type MaybeRef } from 'vue'
import { useCommandState } from './useCommandState'

import type { CommandView } from '../../types/index'

type CreateViewArgs = Pick<CommandView, 'id'>
type AddViewArgs = Pick<CommandView, 'id'>
type FindViewArgs = Pick<CommandView, 'id'>

export function useCommandView(instanceId: MaybeRef<string>) {
  const { initializeState } = useCommandState(instanceId)
  const state = initializeState()

  // Public state
  const currentView = computed(() => state.views.filter((view) => view.active))

  // Private functions
  function createView(args: CreateViewArgs) {
    const { id } = args

    const view: CommandView = {
      id: id,
      // children: {
      //   trigger: undefined,
      //   content: undefined,
      // },
      active: false,
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
      unselectAllViews()
      instance.active = true
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

  return {
    currentView,
    initializeView,
    deleteView,
    getView,
    selectView,
    unselectView,
    unselectAllViews,
    // selectView,
    // selectLastView,
    // activeView,
    // lastActiveView,
  }
}
