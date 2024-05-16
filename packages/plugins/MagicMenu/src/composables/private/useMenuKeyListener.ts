import { nextTick } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'
import { useMenuState } from './useMenuState'

export function useMenuKeyListener(instanceId: string) {
  const {
    getActiveViews,
    getNestedView,
    selectView,
    unselectView,
    selectNextView,
    selectPreviousView,
    unselectAllViews,
  } = useMenuView(instanceId)
  const {
    getViewItems,
    getActiveItems,
    selectItem,
    selectNextItem,
    selectPreviousItem,
    unselectAllItems,
  } = useMenuItem(instanceId)

  const { findState } = useMenuState(instanceId)
  const state = findState()

  function onArrowDown() {
    const activeViews = getActiveViews()
    const activeItems = getActiveItems()

    const lastItem = activeItems[activeItems.length - 1]
    const lastView = activeViews[activeViews.length - 1]

    switch (true) {
      // Top level items, not nested inside a view
      case lastItem.parent.length === 0:
        const items = getViewItems(lastView.id)
        selectItem(items[0].id)
        break
      // Nested items
      default:
        selectNextItem(lastItem.id)
        break
    }
  }

  function onArrowUp() {
    const activeItems = getActiveItems()
    const lastItem = activeItems[activeItems.length - 1]

    // Nested items only
    if (lastItem.parent.length > 0) {
      selectPreviousItem(lastItem.id)
    }
  }

  async function onArrowRight() {
    const activeItems = getActiveItems()
    const activeViews = getActiveViews()

    const lastItem = activeItems[activeItems.length - 1]
    const lastView = activeViews[activeViews.length - 1]

    // Safeguard
    if (!lastView || !lastItem) return

    switch (true) {
      // Top level items, not nested inside a view
      case lastItem.parent.length === 0:
        selectNextView(lastView.id)
        selectNextItem(lastItem.id)
        break
      case lastItem.parent.length > 1:
        // Check if last item has a nested view
        // If it does, select it and select the first item in the nested view
        // if it does not, simply select the next view and item
        const nestedView = getNestedView(lastItem.id)
        if (nestedView) {
          selectView(nestedView.id)

          await nextTick()
          const items = getViewItems(nestedView.id)
          selectItem(items[0].id)
        } else {
          selectNextView(activeViews[0].id)
          selectNextItem(activeItems[0].id)
        }
        break
    }
  }

  function onArrowLeft() {
    const activeViews = getActiveViews()
    const activeItems = getActiveItems()

    const lastItem = activeItems[activeItems.length - 1]
    const lastView = activeViews[activeViews.length - 1]

    // Safeguard
    if (!lastView || !lastItem) return

    switch (true) {
      // Top level items, not nested inside a view
      case lastItem.parent.length === 0:
        selectPreviousView(lastView.id)
        selectPreviousItem(lastItem.id)
        break
      case lastView.parent.length > 1:
        // If the view is a nested view, simply unselect it
        // If the view is a top level view, select the previous view and item
        unselectView(lastView.id)
        break
      default:
        selectPreviousView(activeViews[0].id)
        selectPreviousItem(activeItems[0].id)
    }
  }

  async function onEnter() {}

  function onEscape() {
    state.active.value = false
    unselectAllItems()
    unselectAllViews()
  }

  onKeyStroke('ArrowDown', onArrowDown)
  onKeyStroke('ArrowUp', onArrowUp)
  onKeyStroke('ArrowRight', onArrowRight)
  onKeyStroke('ArrowLeft', onArrowLeft)
  onKeyStroke('Enter', onEnter)
  onKeyStroke('Escape', onEscape)
}
