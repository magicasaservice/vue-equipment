import { reactive, computed, toValue, type MaybeRef } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useCommandState } from './useCommandState'
import type { CommandView } from '../../types/index'

type InitializeViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>
type CreateViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>
type AddViewArgs = Pick<CommandView, 'id' | 'parent' | 'initial'>

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useCommandView(id: MaybeRef<string>) {
  const { initializeState } = useCommandState(id)
  const { logWarning } = useMagicError({
    prefix: 'MagicCommand',
    source: 'MagicCommand',
  })
  const state = initializeState()

  // Cache current instance ID
  const currentInstanceId = toValue(id)

  const currentView = computed(() => {
    const activeViews = state.views.filter((view) => view.active)
    if (activeViews.length === 0) return undefined
    if (activeViews.length === 1) return activeViews[0]

    return activeViews.reduce((a, b) =>
      a.parent.views.length >= b.parent.views.length ? a : b
    )
  })

  // Memoized view lookup map
  const viewMap = new Map<string, CommandView>()

  // Private functions
  function createView(args: CreateViewArgs): CommandView {
    const { id, parent, initial } = args

    if (parent.views.length === 0) {
      parent.views.push(currentInstanceId)
    }

    const view: CommandView = reactive({
      id,
      parent,
      initial,
      active: false,
      items: [],
      channels: [],
      state: {
        selectAbortController: new AbortController(),
        unselectAbortController: new AbortController(),
      },
    })

    // Cache the view
    viewMap.set(id, view)
    return view
  }

  function addView(args: AddViewArgs): CommandView {
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

  function activateView() {
    const view = state?.views.findLast((view) => view.active)?.id
    state.input.view = view
  }

  // Public functions
  function getView(id: string): CommandView | undefined {
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
    if (!view) return -1

    const nestingLevel = view.parent.views.length
    return state.views.findIndex(
      (v) => v.parent.views.length === nestingLevel && v.id === id
    )
  }

  function getNextView(id: string): CommandView | undefined {
    const index = state.views.findIndex((view) => view.id === id)
    return index !== -1 ? state.views[index + 1] : undefined
  }

  function getPreviousView(id: string): CommandView | undefined {
    const index = state.views.findIndex((view) => view.id === id)
    return index > 0 ? state.views[index - 1] : undefined
  }

  function getTopLevelView(): CommandView | undefined {
    return state.views.find((view) => view.active && !view.parent.item)
  }

  function getNestedView(itemId: string): CommandView | undefined {
    return state.views.find((view) => view.parent.item === itemId)
  }

  function getParentView(id: string): CommandView | undefined {
    const view = getView(id)
    if (!view) return undefined

    const parentId = view.parent.views[view.parent.views.length - 1]
    return parentId ? getView(parentId) : undefined
  }

  function getUnrelatedViews(id: string): CommandView[] {
    const view = getView(id)
    if (!view) return []

    const parentViewsSet = new Set(view.parent.views)
    return state.views.filter((v) => v.id !== id && !parentViewsSet.has(v.id))
  }

  async function selectView(id: string, delayMs = 0): Promise<void> {
    const view = getView(id)
    if (!view) return

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
      activateView()
    } catch (error) {
      if (isAbortError(error) && state.options.debug) {
        logWarning('selectView() was interrupted by a call to unselectView()')
      }
    }
  }

  function selectInitialView() {
    const initialView = state.views?.find((view) => view.initial)

    if (initialView) {
      initialView.active = true
      activateView()
    }
  }

  async function unselectView(id: string, delayMs = 0): Promise<void> {
    const view = getView(id)
    if (!view) return

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
      activateView()
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

  function unselectAllViews(): void {
    for (const view of state.views) {
      view.active = false
    }
  }

  function initializeView(args: InitializeViewArgs): CommandView {
    const { id } = args
    const view = getView(id) ?? addView(args)
    return view
  }

  function sortViewItems(viewId: string) {
    const parent = document.querySelector(`[data-id="${viewId}-content"]`)
    const view = getView(viewId)

    const elements: HTMLElement[] = Array.from(
      parent?.querySelectorAll('.magic-command-item') ?? []
    )

    function getIndex(id: string) {
      return elements.findIndex((el) => el.dataset.id === id)
    }

    view?.items?.sort((a, b) => getIndex(a.id) - getIndex(b.id))
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
    selectInitialView,
    unselectView,
    unselectUnrelatedViews,
    unselectAllViews,
    sortViewItems,
  }
}
