import { reactive, computed, toValue, type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import type { MenuView } from '../../types/index'

type InitializeViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>
type CreateViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>
type AddViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>

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
    const { id, parent, placement } = args

    if (parent.views.length === 0) {
      parent.views.push(toValue(instanceId))
    }

    const view: MenuView = {
      id: id,
      parent: parent,
      active: false,
      items: [],
      channels: [],
      placement: placement,
      state: {
        selectAbortController: new AbortController(),
        unselectAbortController: new AbortController(),
      },
    }

    return reactive(view)
  }

  function addView(args: AddViewArgs) {
    const view = createView(args)
    state.views = [...state.views, view]

    return view
  }

  function delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms)
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
  }

  // Public functions
  function initializeView(args: InitializeViewArgs) {
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

  function getUnrelatedViews(id: string) {
    const argView = getView(id)
    return state.views?.filter(
      (view) =>
        !view.parent.views.includes(id) &&
        !argView?.parent.views.includes(view.id) &&
        view.id !== id
    )
  }

  function getDescendingViews(id: string) {
    const argView = getView(id)
    return state.views?.filter(
      (view) => view.id !== id && !argView?.parent.views.includes(view.id)
    )
  }

  async function selectView(id: string, delayMs = 0) {
    const instance = getView(id)

    if (instance) {
      // Cancel any scheduled closing
      if (instance.state.unselectAbortController) {
        instance.state.unselectAbortController.abort()
      }

      // Schedule opening
      const abortController = new AbortController()
      instance.state.selectAbortController = abortController

      try {
        await delay(delayMs, abortController.signal)
        instance.active = true
        unselectUnrelatedViews(id)
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log(
            `selectView() was interrupted by a call to unselectView()`
          )
        } else {
          throw err
        }
      }
    }
  }

  async function unselectView(id: string, delayMs = 0) {
    const instance = getView(id)

    if (instance) {
      // Cancel any scheduled closing
      if (instance.state.selectAbortController) {
        instance.state.selectAbortController.abort()
      }

      // Schedule closing
      const abortController = new AbortController()
      instance.state.unselectAbortController = abortController

      try {
        await delay(delayMs, abortController.signal)
        instance.active = false
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log(
            `unselectView() was interrupted by a call to selectView()`
          )
        } else {
          throw err
        }
      }
    }
  }

  function unselectUnrelatedViews(id: string) {
    const unrelatedViews = getUnrelatedViews(id)
    unrelatedViews.forEach((view) => (view.active = false))
  }

  function unselectDescendingViews(id: string) {
    const descendingViews = getDescendingViews(id)
    descendingViews.forEach((view) => (view.active = false))
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
    unselectUnrelatedViews,
    unselectDescendingViews,
    unselectAllViews,
  }
}
