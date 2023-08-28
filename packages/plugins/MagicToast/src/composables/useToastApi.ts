import { computed, markRaw, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { toValue } from '@vueuse/core'
import { useToastStore } from './useToastStore'
import type { MaybeRef } from '@vueuse/core'
import type { AddArgs } from '../types'

export function useToastApi(id?: MaybeRef<string>) {
  const { findInstance, addInstance, removeInstance } = useToastStore()

  // Private state
  const mappedId = computed(() => toValue(id) || uuidv4())
  const instance = computed(() => findInstance(toValue(mappedId)))

  // Public state
  const toasts = computed(() => instance.value?.toasts)
  const count = computed(() => toasts.value?.length)
  const oldest = computed(() => toasts.value?.[0])

  // Private methods
  function initialize() {
    const id = toValue(mappedId)
    if (!findInstance(id)) {
      addInstance(id)
      return mappedId.value
    }
  }

  function destroy(id: string) {
    if (!id) return
    clear()
    removeInstance(toValue(id))
  }

  // Public methods
  async function add(
    options: Pick<AddArgs, 'component' | 'props' | 'duration'>,
  ) {
    const { component, props, duration } = options
    const id = instance.value?.add({
      props,
      duration,
      component: typeof component === 'string' ? component : markRaw(component),
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
  initialize()

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
