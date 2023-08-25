import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { toValue } from '@vueuse/core'
import { useToastStore } from './useToastStore'

import type { MaybeRef } from '@vueuse/core'

export type UseToastApiOptions = {}

export function useToastApi(
  id?: MaybeRef<string>,
  options?: UseToastApiOptions,
) {
  const { findInstance, addInstanceToStore, removeInstanceFromStore } =
    useToastStore()

  // Private state
  const mappedId = computed(() => toValue(id) || uuidv4())

  // Public state
  const instance = computed(() => findInstance(toValue(mappedId)))
  const toasts = computed(() => instance.value?.toasts)

  function initialize() {
    addInstanceToStore(toValue(mappedId))
  }

  function addToast(id?: string) {
    const mappedId = id || uuidv4()
    instance.value?.add(mappedId)
  }

  function removeToast(id: string) {
    instance.value?.remove(id)
  }

  function removeAllToasts() {
    if (!instance.value) return
    instance.value.toasts = []
  }

  function destroy(id: string) {
    if (!id) return
    removeAllToasts()
    removeInstanceFromStore(toValue(id))
  }

  return {
    instance,
    toasts,
    initialize,
    destroy,
    addToast,
    removeToast,
    removeAllToasts,
  }
}

export type UseToastApiReturn = ReturnType<typeof useToastApi>
