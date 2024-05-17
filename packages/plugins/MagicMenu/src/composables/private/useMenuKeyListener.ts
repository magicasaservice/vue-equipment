import { computed, nextTick, toValue, type MaybeRef } from 'vue'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'
import { useMenuState } from './useMenuState'

export function useMenuKeyListener(instanceId: MaybeRef<string>) {
  const {
    getActiveViews,
    getNestedView,
    selectView,
    unselectView,
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

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const activeItems = computed(() => getActiveItems())
  const activeViews = computed(() => getActiveViews())

  const firstActiveItem = computed(() =>
    activeItems.value.reduce((a, b) =>
      a.parent.length < b.parent.length ? a : b
    )
  )

  const firstActiveView = computed(() =>
    activeViews.value.reduce((a, b) =>
      a.parent.length < b.parent.length ? a : b
    )
  )

  const lastActiveItem = computed(() =>
    activeItems.value.reduce((a, b) =>
      a.parent.length >= b.parent.length ? a : b
    )
  )

  const lastActiveView = computed(() =>
    activeViews.value.reduce((a, b) =>
      a.parent.length >= b.parent.length ? a : b
    )
  )

  const nextView = computed(() => getNestedView(lastActiveItem.value.id))

  // Private functions
  function keyStrokeGuard(e: KeyboardEvent) {
    switch (true) {
      case state.active.value === false:
        throw new Error('Menu is not active')
      default:
        state.mode.value = 'keyboard'
        e.preventDefault()
        e.stopPropagation()
    }
  }

  // Public functions
  async function onArrowRight(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e) {
      console.error(e)
    }

    switch (true) {
      case !!nextView.value:
        if (firstActiveItem.value.id === lastActiveItem.value.id) {
          selectNextItem(firstActiveItem.value.id)
        } else {
          selectView(nextView.value.id)

          await nextTick()
          const items = getViewItems(nextView.value.id)
          selectItem(items[0].id)
        }
        break
      default:
        selectNextItem(firstActiveItem.value.id)
    }
  }

  function onArrowLeft(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e) {
      console.error(e)
    }

    switch (true) {
      case firstActiveView.value.id !== lastActiveView.value.id:
        const items = getViewItems(lastActiveView.value.id)

        if (items.some((item) => item.active)) {
          unselectView(lastActiveView.value.id)
        }

        break
      default:
        selectPreviousItem(firstActiveItem.value.id)
        break
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e) {
      console.error(e)
    }

    const items = getViewItems(lastActiveView.value.id)

    switch (true) {
      case items.some((item) => item.active):
        selectNextItem(lastActiveItem.value.id)
        break
      case firstActiveView.value.id === lastActiveView.value.id:
        selectItem(items[0].id)
        break
      default:
        selectNextItem(lastActiveItem.value.id)
    }
  }

  function onArrowUp(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e) {
      console.error(e)
    }

    const items = getViewItems(lastActiveView.value.id)

    switch (true) {
      case items.some((item) => item.active):
        selectPreviousItem(lastActiveItem.value.id)
        break
      case firstActiveView.value.id === lastActiveView.value.id:
        selectItem(items[items.length - 1].id)
        break
      default:
        selectPreviousItem(lastActiveItem.value.id)
    }
  }

  async function onEnter() {}

  function onEscape(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e) {
      console.error(e)
    }

    state.active.value = false
    unselectAllItems()
    unselectAllViews()
  }

  return {
    onArrowDown,
    onArrowUp,
    onArrowRight,
    onArrowLeft,
    onEnter,
    onEscape,
  }
}
