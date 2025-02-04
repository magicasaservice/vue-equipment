import { computed, toValue, type MaybeRef } from 'vue'
import { useToastState } from './private/useToastState'
import { useToastView } from './private/useToastView'
import type { ToastView } from '../types'

export interface AddArgs {
  component: ToastView['component']
  props: ToastView['props']
  duration?: number
  id?: string
}

export function useMagicToast(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useToastState(toValue(id))
  const state = initializeState()

  const { initializeView, deleteView } = useToastView(id)

  // Public state
  const toasts = computed(() => state?.views)
  const count = computed(() => toasts.value?.length)

  // Public functions
  function add(args: AddArgs) {
    const { id, component, props, duration = 0 } = args
    const view = initializeView({ id, component, props })

    // Remove after timeout
    if (duration > 0) {
      setTimeout(() => {
        deleteView(view.id)
      }, duration)
    }

    return view.id
  }

  function remove(id: string) {
    deleteView(id)
  }

  function expand() {
    state.expanded = true
  }

  function collapse() {
    state.expanded = false
  }

  return {
    toasts,
    count,
    add,
    remove,
    expand,
    collapse,
  }
}

export type UseMagicToastReturn = ReturnType<typeof useMagicToast>
