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
        state.mode = 'keyboard'
        e.preventDefault()
        e.stopPropagation()
    }
  }

  function selectFirstItem(view: MagicMenuView) {
    const viewId = view.id
    const { selectItem } = useMenuItem({ instanceId, viewId })
    selectItem(view.items[0].id)
  }

  // Public functions
  async function onArrowRight(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.viewInFocus
    const viewInFocus = getView(viewId)

    if (viewInFocus) {
      const activeItem = viewInFocus?.items.find((item) => item.active)
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
        state.viewInFocus = nextView.id
        return
      }
    }
  }

  function onArrowLeft(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.viewInFocus
    const viewInFocus = getView(viewId)

    if (viewInFocus && viewInFocus.parent.item) {
      unselectView(viewId)
      state.viewInFocus = getParentView(viewId)?.id ?? ''
      return
    }

    const topLevelView = getTopLevelView()

    const previousView = topLevelView
      ? getPreviousView(topLevelView.id)
      : undefined

    if (previousView) {
      selectView(previousView.id)
      state.viewInFocus = previousView.id
      return
    }
  }

  function onArrowUp(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.viewInFocus
    const viewInFocus = getView(viewId)
    if (!viewInFocus) return

    const activeIndex = viewInFocus.items.findIndex((item) => item.active)
    const prevIndex = activeIndex - 1

    if (prevIndex >= 0) {
      // Select previous item
      const prevItem = viewInFocus.items[prevIndex]
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(prevItem?.id)

      // Unselect all views that are nested deeper than the view in focus
      unselectNonTreeViews(viewId)
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    const viewId = state.viewInFocus
    const viewInFocus = getView(viewId)
    if (!viewInFocus) return

    const activeIndex = viewInFocus.items.findIndex((item) => item.active)
    const nextIndex = activeIndex + 1

    if (nextIndex >= 0) {
      // Select next item
      const nextItem = viewInFocus.items[nextIndex]
      const { selectItem } = useMenuItem({ instanceId, viewId })
      selectItem(nextItem?.id)

      // Unselect all views that are nested deeper than the view in focus
      unselectNonTreeViews(viewId)
    }
  }

  function onEscape(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (_e: unknown) {}

    state.active = false
    state.viewInFocus = ''
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
