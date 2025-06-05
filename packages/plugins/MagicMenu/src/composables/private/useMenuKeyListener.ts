import { type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'
import type { MenuView } from '../../types/index'

export function useMenuKeyListener(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const {
    selectView,
    unselectView,
    unselectUnrelatedViews,
    unselectAllViews,
    getView,
    getNextView,
    getPreviousView,
    getTopLevelView,
    getNestedView,
    getParentView,
  } = useMenuView(instanceId)

  // Private functions
  function keyStrokeGuard(e: KeyboardEvent) {
    switch (true) {
      case !state.active && state.options.debug:
        throw new Error(`'MagicMenu ${state.id} is not active'`)
      case state.active:
        state.input.type = 'keyboard'
        e.stopPropagation()
        e.preventDefault()
        break
      default:
        state.input.type = 'keyboard'
    }
  }

  function getEnabledItems(view: MenuView) {
    return view.items.filter((item) => !item.disabled)
  }

  function selectFirstItem(view: MenuView) {
    const { selectItem } = useMenuItem({ instanceId, viewId: view.id })
    selectItem(getEnabledItems(view)[0]?.id, true)
  }

  // Public functions
  async function onArrowRight(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)

    if (inputView) {
      const activeItem = inputView.items.find((item) => item.active)
      const nestedView = activeItem ? getNestedView(activeItem.id) : undefined

      if (nestedView) {
        selectView(nestedView.id)
        await new Promise((resolve) => requestAnimationFrame(resolve))
        selectFirstItem(nestedView)
        return
      }

      const topLevelView = getTopLevelView()
      const nextView = topLevelView ? getNextView(topLevelView.id) : undefined

      if (nextView && !nextView.parent.item) {
        selectView(nextView.id)
        state.input.view = nextView.id
        return
      }
    }
  }

  function onArrowLeft(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)

    if (inputView && inputView.parent.item) {
      unselectView(viewId)
      state.input.view = getParentView(viewId)?.id ?? ''
      return
    }

    const topLevelView = getTopLevelView()

    const previousView = topLevelView
      ? getPreviousView(topLevelView.id)
      : undefined

    if (previousView) {
      selectView(previousView.id)
      state.input.view = previousView.id
      return
    }
  }

  function onArrowUp(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)
    if (!inputView) return

    const enabledItems = getEnabledItems(inputView)
    const prevIndex = enabledItems.findIndex((item) => item.active) - 1

    if (prevIndex >= 0) {
      // Select previous item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[prevIndex]?.id, true)

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    } else if (prevIndex !== -1) {
      // Select last item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[enabledItems.length - 1]?.id, true)

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)
    if (!inputView) return

    const enabledItems = getEnabledItems(inputView)
    const nextIndex = enabledItems.findIndex((item) => item.active) + 1

    if (nextIndex >= 0) {
      // Select next item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[nextIndex]?.id, true)

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    }
  }

  function onEscape(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    state.active = false
    state.input.view = ''
    unselectAllViews()
  }

  async function onReturn(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      console.warn(e)
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)

    if (inputView) {
      const activeItem = inputView.items.find((item) => item.active)
      const nestedView = activeItem ? getNestedView(activeItem.id) : undefined

      if (nestedView) {
        selectView(nestedView.id)
        await new Promise((resolve) => requestAnimationFrame(resolve))
        selectFirstItem(nestedView)
        return
      }
    }
  }

  function onTab(e: KeyboardEvent) {
    if (state.active) {
      try {
        keyStrokeGuard(e)
      } catch (e: unknown) {
        console.warn(e)
      }
    }
  }

  return {
    onArrowRight,
    onArrowLeft,
    onArrowUp,
    onArrowDown,
    onEscape,
    onEnter,
    onTab,
  }
}
