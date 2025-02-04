import { computed, toValue, type MaybeRef } from 'vue'
import { useToastState } from './private/useToastState'
import { useToastView } from './private/useToastView'
import type { AddViewArgs } from './private/useToastView'

export interface AddArgs {
  component: AddViewArgs['component']
  props: AddViewArgs['props']
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

  return {
    toasts,
    count,
    add,
    remove,
  }
}

export type UseMagicToastReturn = ReturnType<typeof useMagicToast>
