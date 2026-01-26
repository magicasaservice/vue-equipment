import { computed, toValue, nextTick, type MaybeRef } from 'vue'
import { useToastState } from './private/useToastState'
import { useToastView } from './private/useToastView'
import type { ToastView } from '../types'

export interface AddArgs {
  component: ToastView['component']
  props?: ToastView['props']
  slots?: ToastView['slots']
  duration?: number
  id?: string
}

export function useMagicToast(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useToastState(toValue(id))
  const state = initializeState()

  const { initializeView, deleteView } = useToastView(id)

  // Public state
  const toasts = computed(() => state.views)
  const count = computed(() => toasts.value?.length)

  // Public functions
  function add(args: AddArgs) {
    const { id, component, props, slots, duration } = args
    const view = initializeView({ id, component, props, slots })

    const mappedDuration = duration ?? state.options.duration

    // Remove after timeout
    if (mappedDuration > 0) {
      setTimeout(() => {
        deleteView(view.id)
      }, mappedDuration)
    }

    return view.id
  }

  function remove(id: string) {
    deleteView(id)
  }

  async function clear(transition?: string) {
    // Save transition
    const lastTransition = state.options.transition

    // Set transition
    state.options.transition = transition ?? ''

    // Clear
    state.views = []
    await nextTick()

    // Restore transition
    state.options.transition = lastTransition
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
    clear,
    expand,
    collapse,
  }
}

export type UseMagicToastReturn = ReturnType<typeof useMagicToast>
