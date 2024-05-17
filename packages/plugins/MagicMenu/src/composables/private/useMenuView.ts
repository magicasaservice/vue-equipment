import { reactive, toRefs, toValue, type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import type { MagicMenuView } from '../../types/index'
import { useMenuUtils } from './useMenuUtils'

type CreateViewArgs = {
  id: string
  parentTree: string[]
}

type AddViewArgs = {
  id: string
  parentTree: string[]
}

type FindViewArgs = {
  id: string
  parentTree: string[]
}

export function useMenuView(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  // Private functions
  const { arraysAreEqual } = useMenuUtils()

  function createView(args: CreateViewArgs) {
    const { id, parentTree } = args

    if (parentTree.length === 0) {
      parentTree.push(toValue(instanceId))
    }

    const view: MagicMenuView = {
      id: id,
      parent: parentTree,
      active: false,
    }

    return reactive(view)
  }

  function addView(args: AddViewArgs) {
    const view = createView(args)
    state.views.value = [...state.views.value, view]

    return view
  }

  // Public functions
  function initializeView(args: FindViewArgs) {
    const { id } = args
    let instance = getView(id)

    if (!instance) instance = addView(args)
    return toRefs(instance)
  }

  function deleteView(id: string) {
    state.views.value = state.views.value.filter(
      (x: MagicMenuView) => x.id !== id
    )
  }

  function getView(id: string) {
    return state.views.value.find((view) => {
      return view.id === id
    })
  }

  function getActiveViews() {
    return state.views.value.filter((view) => {
      return view.active
    })
  }

  function getNestedView(itemId: string) {
    return state.views.value.find((view) => {
      return view.parent[view.parent.length - 1] === itemId
    })
  }

  function getViewSiblings(id: string, includeSelf = true) {
    const instance = getView(id)
    if (!instance?.parent) return []

    // In order to match the parent tree, the last item needs to be removed
    // The last parent view is the one that is relevant here
    const mappedParent = [...instance.parent].slice(0, -1)
    const siblings = state.views.value.filter((item) => {
      const mappedItemParent = [...item.parent].slice(0, -1)

      return includeSelf
        ? arraysAreEqual(mappedParent, mappedItemParent)
        : arraysAreEqual(mappedParent, mappedItemParent) && item.id !== id
    })

    return siblings
  }

  function getNextView(id: string) {
    const siblings = getViewSiblings(id)
    const index = siblings.findIndex((item) => {
      return item.id === id
    })

    return siblings[index + 1]
  }

  function getPreviousView(id: string) {
    const siblings = getViewSiblings(id)
    const index = siblings.findIndex((item) => {
      return item.id === id
    })

    return siblings[index - 1]
  }

  function selectView(id: string) {
    // Activate view
    const instance = getView(id)

    if (instance) {
      instance.active = true
    }

    // Deactivate sibling views in the same branch
    const siblings = getViewSiblings(id, false)

    siblings.forEach((sibling) => {
      sibling.active = false
    })
  }

  function unselectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = false
    }
  }

  function selectNestedView(itemId: string) {
    const instance = getNestedView(itemId)

    if (instance) {
      instance.active = true
    }
  }

  function unselectNestedViews(id: string) {
    const siblingNestedViews = state.views.value.filter((view) => {
      return view.parent[view.parent.length - 2] === id
    })

    siblingNestedViews.forEach((view) => {
      view.active = false
    })
  }

  function selectNextView(id: string) {
    const nextView = getNextView(id)

    if (nextView) {
      selectView(nextView.id)
    }
  }

  function selectPreviousView(id: string) {
    const previousView = getPreviousView(id)

    if (previousView) {
      selectView(previousView.id)
    }
  }

  function unselectAllViews() {
    state.views.value.forEach((view) => {
      view.active = false
    })
  }

  return {
    initializeView,
    deleteView,
    getView,
    getActiveViews,
    getNestedView,
    getNextView,
    getPreviousView,
    selectView,
    unselectView,
    selectNestedView,
    selectNextView,
    selectPreviousView,
    unselectNestedViews,
    unselectAllViews,
  }
}
