import { computed, toValue, nextTick, type MaybeRef } from 'vue'
import { useToastTimeout } from './private/useToastTimeout'
import { useToastState } from './private/useToastState'
import { useToastView } from './private/useToastView'
import type { ToastView, MagicToastAddOptions } from '../types'

export interface AddArgs {
  component: ToastView['component']
  props?: ToastView['props']
  slots?: ToastView['slots']
  options?: MagicToastAddOptions
  id?: string
}

export function useMagicToast(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useToastState(toValue(id))
  const state = initializeState()

  const { initializeView, deleteView } = useToastView(id)

  // Public state
  const toasts = computed(() => state.views.visible)
  const count = computed(() => toasts.value?.length)
  const hidden = computed(() => state.views.hidden?.length)

  // Public functions
  function add(args: AddArgs) {
    // Adding a toast while the stack is hidden reveals everything again,
    // rather than silently queuing the new toast out of view.
    if (state.views.hidden.length > 0) {
      state.views.visible = state.views.hidden
      state.views.hidden = []
      state.views.visible.forEach((view) => {
        view.timeout?.play()
      })
    }

    const { id, component, props, slots, options } = args
    const view = initializeView({ id, component, props, slots, options })

    const mappedDuration = options?.duration ?? state.options.duration

    // Remove after timeout
    if (mappedDuration > 0) {
      view.timeout = useToastTimeout(() => deleteView(view.id), {
        delay: mappedDuration,
        immediate: true,
      })
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

    // Clear, including any toasts currently hidden via hide()
    state.views.visible = []
    state.views.hidden = []
    await nextTick()

    // Restore transition
    state.options.transition = lastTransition
  }

  async function hide(transition?: string) {
    // Nothing to hide, or already hidden
    if (state.views.visible.length === 0) {
      return
    }

    // Save transition
    const lastTransition = state.options.transition

    // Set transition
    state.options.transition = transition ?? ''

    // Pause timeouts while hidden
    state.views.visible.forEach((view) => {
      view.timeout?.pause()
    })

    // Stash views so they can be restored via show()
    state.views.hidden = state.views.visible
    state.views.visible = []
    await nextTick()

    // Restore transition
    state.options.transition = lastTransition
  }

  async function show(transition?: string) {
    // Nothing hidden to restore
    if (state.views.hidden.length === 0) {
      return
    }

    // Save transition
    const lastTransition = state.options.transition

    // Set transition
    state.options.transition = transition ?? ''

    // Restore stashed views
    state.views.visible = state.views.hidden
    state.views.hidden = []
    await nextTick()

    // Resume timeouts
    state.views.visible.forEach((view) => {
      view.timeout?.play()
    })

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
    hidden,
    add,
    remove,
    clear,
    hide,
    show,
    expand,
    collapse,
  }
}

export type UseMagicToastReturn = ReturnType<typeof useMagicToast>
