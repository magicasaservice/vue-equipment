import { reactive, markRaw, type MaybeRef } from 'vue'
import { useToastState } from './useToastState'
import { type ToastView } from '../../types'

export type AddViewArgs = Omit<ToastView, 'remove' | 'id' | 'active'> & {
  id?: string
  active?: boolean
}

type CreateViewArgs = AddViewArgs
type InitializeViewArgs = AddViewArgs

export function useToastView(instanceId: MaybeRef<string>) {
  const { initializeState } = useToastState(instanceId)
  const state = initializeState()

  // Private functions
  function uuid() {
    return Math.random().toString(36).slice(2, 11)
  }

  function createView(args: CreateViewArgs) {
    const { id = uuid(), props, component } = args

    const view: ToastView = {
      component: markRaw(component),
      props,
      id,
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
    const view = getView(id ?? '') ?? addView(args)

    return view
  }

  function deleteView(id: string) {
    state.views = state.views?.filter((view) => view.id !== id)
  }

  function getView(id: string) {
    return state.views?.find((view) => view.id === id)
  }

  return {
    initializeView,
    deleteView,
    getView,
  }
}
