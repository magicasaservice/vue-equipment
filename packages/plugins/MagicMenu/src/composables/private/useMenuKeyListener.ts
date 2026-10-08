import { useEventListener } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMenuState } from './useMenuState'
import { useMenuView } from './useMenuView'
import { useMenuItem } from './useMenuItem'

import type { MaybeRef } from 'vue'
import type { MenuView } from '../../types/index'

type SelectItemArgs = {
  viewId: string
  id: string
}

export function useMenuKeyListener(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()
  const { throwError, logWarning } = useMagicError({
    prefix: 'MagicMenu',
    source: 'useMenuKeyListener',
  })

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

  const { selectItem } = useMenuItem(instanceId)

  // Private functions
  function keyStrokeGuard(e: KeyboardEvent) {
    switch (true) {
      case !state.active && state.options.debug:
        throwError({
          message: `'MagicMenu ${state.id} is not active'`,
          errorCode: 'menu_not_active',
        })
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

  function selectItemByKeyboard(args: SelectItemArgs) {
    selectItem(args)

    if (!state.input.disabled.includes('pointer')) {
      state.input.disabled = [...state.input.disabled, 'pointer']
    }
  }

  function enablePointer() {
    if (state.input.disabled.includes('pointer')) {
      state.input.disabled = state.input.disabled.filter(
        (input) => input !== 'pointer'
      )
    }
  }

  function selectFirstItem(view: MenuView) {
    const firstItem = getEnabledItems(view)[0]

    if (firstItem) {
      selectItemByKeyboard({ viewId: view.id, id: firstItem.id })
    }
  }

  // Public functions
  async function onArrowRight(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      logWarning(String(e))
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
      logWarning(String(e))
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
      logWarning(String(e))
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)
    if (!inputView) {
      return
    }

    const enabledItems = getEnabledItems(inputView)
    const prevIndex = enabledItems.findIndex((item) => item.active) - 1

    if (prevIndex >= 0) {
      // Select previous item
      const prevItem = enabledItems[prevIndex]

      if (prevItem) {
        selectItemByKeyboard({ viewId, id: prevItem.id })
      }

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    } else if (prevIndex !== -1) {
      // Select last item
      const lastItem = enabledItems[enabledItems.length - 1]

      if (lastItem) {
        selectItemByKeyboard({ viewId, id: lastItem.id })
      }

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    }
  }

  function onArrowDown(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      logWarning(String(e))
    }

    if (!state.input.view) {
      return
    }

    const viewId = state.input.view
    const inputView = getView(viewId)
    if (!inputView) {
      return
    }

    const enabledItems = getEnabledItems(inputView)
    const nextIndex = enabledItems.findIndex((item) => item.active) + 1

    if (nextIndex >= 0) {
      // Select next item
      const nextItem = enabledItems[nextIndex]

      if (nextItem) {
        selectItemByKeyboard({ viewId, id: nextItem.id })
      }

      // Unselect all views that are nested deeper than the view in focus
      unselectUnrelatedViews(viewId)
    }
  }

  function onEscape(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      logWarning(String(e))
    }

    state.active = false
    state.input.view = ''
    unselectAllViews()
  }

  async function onReturn(e: KeyboardEvent) {
    try {
      keyStrokeGuard(e)
    } catch (e: unknown) {
      logWarning(String(e))
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
        logWarning(String(e))
      }
    }
  }

  // Lifecycle
  useEventListener('pointermove', enablePointer, { passive: true })

  return {
    onArrowRight,
    onArrowLeft,
    onArrowUp,
    onArrowDown,
    onEscape,
    onReturn,
    onTab,
  }
}
