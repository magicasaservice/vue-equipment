import {
  computed,
  onUnmounted,
  onBeforeMount,
  toValue,
  markRaw,
  type MaybeRef,
} from 'vue'
import { useToastStore } from './private/useToastStore'
import type { AddArgs } from './../types'

export function useToastApi(id?: MaybeRef<string>) {
  const { findInstance, addInstance, removeInstance } = useToastStore()

  // Private state
  const mappedId = computed(() => toValue(id) || crypto.randomUUID())
  const instance = computed(() => findInstance(toValue(mappedId)))

  // Private methods
  function initialize() {
    const id = toValue(mappedId)
    if (!findInstance(id)) {
      return addInstance(id)
    }
  }

  function destroy(id: string) {
    if (!id) return
    clear()
    removeInstance(toValue(id))
  }

  // Public state
  const toasts = computed(() => instance.value?.toasts)
  const count = computed(() => toasts.value?.length)
  const oldest = computed(() => toasts.value?.[0])

  // Public methods
  async function add(options: AddArgs) {
    const { component, props, duration } = options
    const id = instance.value?.add({
      props,
      duration,
      component: markRaw(component),
    })
    return id
  }

  function remove(id: string) {
    instance.value?.remove(id)
  }

  function clear() {
    if (!instance.value) return
    instance.value.toasts = []
  }

  // Lifecycle
  onBeforeMount(() => {
    initialize()
  })

  onUnmounted(() => {
    destroy(toValue(mappedId))
  })

  return {
    toasts,
    count,
    oldest,
    add,
    remove,
    clear,
  }
}

export type UseToastApiReturn = ReturnType<typeof useToastApi>
