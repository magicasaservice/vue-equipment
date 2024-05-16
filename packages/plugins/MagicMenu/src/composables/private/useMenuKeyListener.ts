import { nextTick } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'
import { useMenuState } from './useMenuState'

export function useMenuKeyListener(instanceId: string) {
  const {
    getActiveView,
    getNestedView,
    getNextView,
    getPreviousView,
    selectView,
    unselectView,
    selectNextView,
    selectPreviousView,
    unselectAllViews,
  } = useMenuView(instanceId)
  const {
    getViewItems,
    getActiveItem,
    selectItem,
    selectNextItem,
    selectPreviousItem,
    unselectAllItems,
  } = useMenuItem(instanceId)

  const { findState } = useMenuState(instanceId)
  const state = findState()

  function onArrowDown() {
    const activeView = getActiveView()

    if (activeView) {
      const items = getViewItems(activeView.id)
      const activeItem = items.find((item) => item.active)

      if (activeItem) {
        selectNextItem(activeItem.id)
      } else {
        selectItem(items[0].id)
      }
    }
  }

  function onArrowUp() {
    const activeView = getActiveView()

    if (activeView) {
      const items = getViewItems(activeView.id)
      const activeItem = items.find((item) => item.active)

      if (activeItem) {
        selectPreviousItem(activeItem.id)
      }
    }
  }

  async function onArrowRight() {
    const activeView = getActiveView()
    const activeItem = getActiveItem()

    // Open view
    if (activeView) {
      const items = getViewItems(activeView.id)
      const activeNestedItem = items.find((item) => item.active)

      // Nested active item
      if (activeNestedItem) {
        const nestedView = getNestedView(activeNestedItem.id)

        // Nested active item has a nested view
        if (nestedView) {
          selectView(nestedView.id)
          await nextTick()

          // Select first item in nested view
          const items = getViewItems(nestedView.id)
          selectItem(items[0].id)
        } else {
          // Nested active item does not have a nested view
          // Switch to next view
          const nextView = getNextView(activeView.id)
          const parentId = nextView.parent[activeView.parent.length - 1]
          selectView(nextView.id)
          selectItem(parentId)
        }
      } else {
        // No nested active item
        selectNextView(activeView.id)

        if (activeItem) {
          selectNextItem(activeItem.id)
        }
      }
    } else {
      if (activeItem) {
        selectNextItem(activeItem.id)
      }
    }
  }

  function onArrowLeft() {
    const activeView = getActiveView()

    if (activeView) {
      if (activeView.parent.length > 1) {
        unselectView(activeView.id)
      } else {
        const previousView = getPreviousView(activeView.id)
        const parentId = previousView.parent[activeView.parent.length - 1]
        selectView(previousView.id)
        selectItem(parentId)
      }
    }
  }

  async function onEnter() {
    const activeView = getActiveView()

    if (activeView) {
      const items = getViewItems(activeView.id)
      const activeNestedItem = items.find((item) => item.active)

      // Nested active item
      if (activeNestedItem) {
        const nestedView = getNestedView(activeNestedItem.id)

        // Nested active item has a nested view
        if (nestedView) {
          selectView(nestedView.id)
          await nextTick()

          // Select first item in nested view
          const items = getViewItems(nestedView.id)
          selectItem(items[0].id)
        }
      }
    }
  }

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
