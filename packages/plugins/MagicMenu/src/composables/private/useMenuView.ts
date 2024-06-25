import { reactive, computed, toValue, type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import type { MenuView } from '../../types/index'
import { useMenuUtils } from './useMenuUtils'

type CreateViewArgs = Pick<MenuView, 'id' | 'parent'>
type AddViewArgs = Pick<MenuView, 'id' | 'parent'>
type FindViewArgs = Pick<MenuView, 'id' | 'parent'>

export function useMenuView(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  // Public state
  const currentView = computed(() =>
    state.views
      .filter((view) => view.active)
      .reduce((a, b) =>
        a.parent.views.length >= b.parent.views.length ? a : b
      )
  )

  // Private functions
  function createView(args: CreateViewArgs) {
    const { id, parent } = args

    if (parent.views.length === 0) {
      parent.views.push(toValue(instanceId))
    }

    const view: MenuView = {
      id: id,
      parent: parent,
      children: {
        trigger: undefined,
        content: undefined,
      },
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
    return state.views?.find((view) => view.id === id)
  }

  function getRelativeViewIndex(id: string) {
    const view = getView(id)
    const nestingLevel = view?.parent.views.length

    return state.views
      ?.filter((view) => view.parent.views.length === nestingLevel)
      .findIndex((view) => view.id === id)
  }

  function getNextView(id: string) {
    const index = state.views?.findIndex((view) => view.id === id)
    return state.views?.[index + 1]
  }

  function getPreviousView(id: string) {
    const index = state.views?.findIndex((view) => view.id === id)
    return state.views?.[index - 1]
  }

  function getTopLevelView() {
    return state.views?.find((view) => view.active && !view.parent.item)
  }

  function getNestedView(itemId: string) {
    return state.views?.find((view) => view.parent.item === itemId)
  }

  function getParentView(id: string) {
    const view = getView(id)
    const parentId = view?.parent.views[view.parent.views.length - 1]
    return getView(parentId ?? '')
  }

  function getNonTreeViews(id: string) {
    const currentView = getView(id)
    return state.views?.filter(
      (view) => !currentView?.parent.views.includes(view.id) && view.id !== id
    )
  }

  function selectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = true
      unselectNonTreeViews(id)
    }
  }

  function unselectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = false
    }
  }

  function unselectNonTreeViews(id: string) {
    const nonTreeViews = getNonTreeViews(id)
    nonTreeViews.forEach((view) => (view.active = false))
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
    getRelativeViewIndex,
    getNextView,
    getPreviousView,
    getTopLevelView,
    getNestedView,
    getParentView,
    selectView,
    unselectView,
    unselectNonTreeViews,
    unselectAllViews,
  }
}
