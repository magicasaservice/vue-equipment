import { reactive, type MaybeRef } from 'vue'
import { useAccordionState } from './useAccordionState'
import { type AccordionView } from '../../types'

type CreateViewArgs = Pick<AccordionView, 'id' | 'active'>
type AddViewArgs = Pick<AccordionView, 'id' | 'active'>
type InitializeViewArgs = Pick<AccordionView, 'id' | 'active'>

export function useAccordionView(instanceId: MaybeRef<string>) {
  const { initializeState } = useAccordionState(instanceId)
  const state = initializeState()

  // Private functions
  function createView(args: CreateViewArgs) {
    const { id, active = false } = args

    const view: AccordionView = {
      id,
      active,
    }

    return reactive(view)
  }

  function addView(args: AddViewArgs) {
    const view = createView(args)
    state.views = [...state.views, view]

    return view
  }

  // Public functions
  function initializeView(args: InitializeViewArgs) {
    const { id, active } = args
    const view = getView(id) ?? addView(args)

    // Select view if active was passed as argument
    // Useful if the view is initialized multiple times with different active states
    if (active) {
      selectView(id)
    }

    return view
  }

  function deleteView(id: string) {
    state.views = state.views?.filter((view) => view.id !== id)
  }

  function getView(id: string) {
    return state.views?.find((view) => view.id === id)
  }

  function selectView(id: string) {
    const view = getView(id)

    if (view) {
      if (state.options.mode === 'single') {
        unselectAllViews()
      }

      view.active = true
    }
  }

  function unselectView(id: string) {
    const view = getView(id)

    if (view) {
      view.active = false
    }
  }

  function unselectAllViews() {
    state.views?.forEach((view) => {
      view.active = false
    })
  }

  return {
    initializeView,
    deleteView,
    getView,
    selectView,
    unselectView,
    unselectAllViews,
  }
}
