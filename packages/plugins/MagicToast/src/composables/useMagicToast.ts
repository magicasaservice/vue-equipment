import { computed, toValue, markRaw, type MaybeRef } from 'vue'
import { useToastStore } from './private/useToastStore'
import type { AddToastArgs } from './../types'

export function useMagicToast(id: MaybeRef<string>) {
  const { findInstance } = useToastStore()

  // Private state
  const instance = computed(() => findInstance(toValue(id)))

  // Public state
  const toasts = computed(() => instance.value?.toasts)
  const count = computed(() => toasts.value?.length)
  const firstToast = computed(() => toasts.value?.[0])
  const lastToast = computed(() => toasts.value?.[toasts.value.length - 1])

  // Public methods
  async function add(options: AddToastArgs) {
    const { component, props, duration } = options
    const toastId = instance.value?.add({
      props,
      duration,
      component: markRaw(component),
    })
    return toastId
  }

  function remove(toastId: string) {
    instance.value?.remove(toastId)
  }

  function clear() {
    if (!instance.value) return
    instance.value.toasts = []
  }

  return {
    toasts,
    count,
    firstToast,
    lastToast,
    add,
    remove,
    clear,
  }
}

export type UseMagicToastReturn = ReturnType<typeof useMagicToast>
