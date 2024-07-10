import { reactive, type MaybeRef } from 'vue'
import { useAccordionState } from './useAccordionState'
import { type AccordionView } from '../../types'

type CreateViewArgs = Pick<AccordionView, 'id'>
type AddViewArgs = Pick<AccordionView, 'id'>
type InitializeViewArgs = Pick<AccordionView, 'id'>

export function useAccordionView(instanceId: MaybeRef<string>) {
  const { initializeState } = useAccordionState(instanceId)
  const state = initializeState()

  // Private functions
  function createView(args: CreateViewArgs) {
    const { id } = args

    const view: AccordionView = {
      id: id,
      active: false,
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
    const { id } = args
    let instance = getView(id)

    if (!instance) instance = addView(args)
    return instance
  }

  function deleteView(id: string) {
    state.views = state.views?.filter((view) => view.id !== id)
  }

  function getView(id: string) {
    return state.views?.find((view) => view.id === id)
  }

  function selectView(id: string) {
    const instance = getView(id)

    if (instance) {
      if (state.options.mode === 'single') {
        unselectAllViews()
      }

      instance.active = true
    }
  }

  function unselectView(id: string) {
    const instance = getView(id)

    if (instance) {
      instance.active = false
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
