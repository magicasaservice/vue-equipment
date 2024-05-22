import { nextTick, type MaybeRef } from 'vue'
import { useMenuState } from './useMenuState'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'
import type { MagicMenuView } from '../../types/index'

export function useMenuKeyListener(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const {
    selectView,
    unselectView,
    unselectNonTreeViews,
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
      case !state.active:
        throw new Error('Menu is not active')
      default:
        state.input = 'keyboard'
        e.preventDefault()
        e.stopPropagation()
    }
  }

  function getEnabledItems(view: MagicMenuView) {
    return view.items.filter((item) => !item.disabled)
  }

  function selectFirstItem(view: MagicMenuView) {
    const { selectItem } = useMenuItem({ instanceId, viewId: view.id })
    selectItem(getEnabledItems(view)[0].id)
  }

  // Public functions
  async function onArrowRight(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.inputView
    const inputView = getView(viewId)

    if (inputView) {
      const activeItem = inputView?.items.find((item) => item.active)
      const nestedView = activeItem ? getNestedView(activeItem.id) : undefined

      if (nestedView) {
        selectView(nestedView.id)
        await nextTick()
        selectFirstItem(nestedView)
        return
      }

      const topLevelView = getTopLevelView()
      const nextView = topLevelView ? getNextView(topLevelView.id) : undefined

      if (nextView && !nextView.parent.item) {
        selectView(nextView.id)
        state.inputView = nextView.id
        return
      }
    }
  }

  function onArrowLeft(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.inputView
    const inputView = getView(viewId)

    if (inputView && inputView.parent.item) {
      unselectView(viewId)
      state.inputView = getParentView(viewId)?.id ?? ''
      return
    }

    const topLevelView = getTopLevelView()

    const previousView = topLevelView
      ? getPreviousView(topLevelView.id)
      : undefined

    if (previousView) {
      selectView(previousView.id)
      state.inputView = previousView.id
      return
    }
  }

  function onArrowUp(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.inputView
    const inputView = getView(viewId)
    if (!inputView) return

    const enabledItems = getEnabledItems(inputView)
    const prevIndex = enabledItems.findIndex((item) => item.active) - 1

    if (prevIndex >= 0) {
      // Select previous item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[prevIndex]?.id)

      // Unselect all views that are nested deeper than the view in focus
      unselectNonTreeViews(viewId)
    } else if (prevIndex !== -1) {
      // Select last item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[enabledItems.length - 1]?.id)

      // Unselect all views that are nested deeper than the view in focus
      unselectNonTreeViews(viewId)
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.inputView
    const inputView = getView(viewId)
    if (!inputView) return

    const enabledItems = getEnabledItems(inputView)
    const nextIndex = enabledItems.findIndex((item) => item.active) + 1

    if (nextIndex >= 0) {
      // Select next item
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(enabledItems[nextIndex]?.id)

      // Unselect all views that are nested deeper than the view in focus
      unselectNonTreeViews(viewId)
    }
  }

  function onEscape(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    state.active = false
    state.inputView = ''
    unselectAllViews()
  }

  return {
    onArrowRight,
    onArrowLeft,
    onArrowUp,
    onArrowDown,
    onEscape,
  }
}
