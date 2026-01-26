import { reactive, markRaw, type MaybeRef } from 'vue'
import { useToastState } from './useToastState'
import { type ToastView } from '../../types'

export type AddViewArgs = Pick<ToastView, 'component' | 'props' | 'slots'> & {
  id?: string
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
    const { id = uuid(), props, slots, component } = args

    const view: ToastView = {
      component: markRaw(component),
      props,
      slots,
      id,
      dragStart: undefined,
      dragging: false,
      shouldClose: false,
      interpolateTo: undefined,
      snappedX: 0,
      snappedY: 0,
      originX: 0,
      originY: 0,
      lastDraggedX: 0,
      lastDraggedY: 0,
      draggedX: 0,
      draggedY: 0,
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
