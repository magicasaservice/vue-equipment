import { reactive, computed, toValue, type MaybeRef } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMenuState } from './useMenuState'
import type { MenuView } from '../../types/index'

type InitializeViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>
type CreateViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>
type AddViewArgs = Pick<MenuView, 'id' | 'parent' | 'placement'>

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useMenuView(instanceId: MaybeRef<string>) {
  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()
  const { logWarning } = useMagicError({
    prefix: 'MagicMenu',
    source: 'useMenuView',
  })

  // Cache current instance ID
  const currentInstanceId = toValue(instanceId)

  const currentView = computed(() => {
    const activeViews = state.views.filter((view) => view.active)
    if (activeViews.length === 0) {
      return undefined
    }
    if (activeViews.length === 1) {
      return activeViews[0]
    }

    return activeViews.reduce((a, b) =>
      a.parent.views.length >= b.parent.views.length ? a : b
    )
  })

  // Memoized view lookup map
  const viewMap = new Map<string, MenuView>()

  function createView(args: CreateViewArgs): MenuView {
    const { id, parent, placement } = args

    if (parent.views.length === 0) {
      parent.views.push(currentInstanceId)
    }

    const view: MenuView = reactive({
      id,
      parent,
      active: false,
      items: [],
      channels: [],
      placement,
      state: {
        selectAbortController: new AbortController(),
        unselectAbortController: new AbortController(),
      },
    })

    // Cache the view
    viewMap.set(id, view)
    return view
  }

  function addView(args: AddViewArgs): MenuView {
    const view = createView(args)
    state.views.push(view)
    return view
  }

  function delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms)
      const abortHandler = () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      }
      signal.addEventListener('abort', abortHandler, { once: true })
    })
  }

  function getView(id: string): MenuView | undefined {
    // Check cache first
    let view = viewMap.get(id)
    if (!view) {
      view = state.views.find((v) => v.id === id)
      if (view) viewMap.set(id, view)
    }
    return view
  }

  function deleteView(id: string): void {
    const index = state.views.findIndex((view) => view.id === id)
    if (index !== -1) {
      state.views.splice(index, 1)
      viewMap.delete(id)
    }
  }

  function getRelativeViewIndex(id: string): number {
    const view = getView(id)
    if (!view) {
      return -1
    }

    const nestingLevel = view.parent.views.length
    return state.views.findIndex(
      (v) => v.parent.views.length === nestingLevel && v.id === id
    )
  }

  function getNextView(id: string): MenuView | undefined {
    const index = state.views.findIndex((view) => view.id === id)
    return index !== -1 ? state.views[index + 1] : undefined
  }

  function getPreviousView(id: string): MenuView | undefined {
    const index = state.views.findIndex((view) => view.id === id)
    return index > 0 ? state.views[index - 1] : undefined
  }

  function getTopLevelView(): MenuView | undefined {
    return state.views.find((view) => view.active && !view.parent.item)
  }

  function getNestedView(itemId: string): MenuView | undefined {
    return state.views.find((view) => view.parent.item === itemId)
  }

  function getParentView(id: string): MenuView | undefined {
    const view = getView(id)
    if (!view) {
      return undefined
    }

    const parentId = view.parent.views[view.parent.views.length - 1]
    return parentId ? getView(parentId) : undefined
  }

  function getUnrelatedViews(id: string): MenuView[] {
    const view = getView(id)
    if (!view) {
      return []
    }

    const parentViewsSet = new Set(view.parent.views)
    return state.views.filter((v) => v.id !== id && !parentViewsSet.has(v.id))
  }

  function getDescendingViews(id: string): MenuView[] {
    const view = getView(id)
    if (!view) {
      return []
    }

    const parentViewsSet = new Set(view.parent.views)
    return state.views.filter((v) => v.id !== id && !parentViewsSet.has(v.id))
  }

  async function selectView(id: string, delayMs = 0): Promise<void> {
    const view = getView(id)
    if (!view) {
      return
    }

    if (view.state.unselectAbortController) {
      view.state.unselectAbortController.abort()
    }

    const abortController = new AbortController()
    view.state.selectAbortController = abortController

    try {
      if (delayMs > 0) {
        await delay(delayMs, abortController.signal)
      }
      view.active = true
      unselectUnrelatedViews(id)
    } catch (error) {
      if (isAbortError(error) && state.options.debug) {
        logWarning('selectView() was interrupted by a call to unselectView()')
      }
    }
  }

  async function unselectView(id: string, delayMs = 0): Promise<void> {
    const view = getView(id)
    if (!view) {
      return
    }

    if (view.state.selectAbortController) {
      view.state.selectAbortController.abort()
    }

    const abortController = new AbortController()
    view.state.unselectAbortController = abortController

    try {
      if (delayMs > 0) {
        await delay(delayMs, abortController.signal)
      }
      view.active = false
    } catch (error) {
      if (isAbortError(error) && state.options.debug) {
        logWarning('unselectView() was interrupted by a call to selectView()')
      }
    }
  }

  function unselectUnrelatedViews(id: string): void {
    const views = getUnrelatedViews(id)
    for (const view of views) {
      view.active = false
    }
  }

  function unselectDescendingViews(id: string): void {
    const views = getDescendingViews(id)
    for (const view of views) {
      view.active = false
    }
  }

  function unselectAllViews(): void {
    for (const view of state.views) {
      view.active = false
    }
  }

  function initializeView(args: InitializeViewArgs): MenuView {
    const { id } = args
    const view = getView(id) ?? addView(args)
    return view
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
