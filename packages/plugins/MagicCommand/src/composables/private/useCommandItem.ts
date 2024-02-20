import { ref, computed, type MaybeRef } from 'vue'
import { useCommandStore } from './useCommandStore'
import { toValue } from '@vueuse/core'

const activeItem = ref<string | undefined>(undefined)

export function useCommandItem(id: MaybeRef<string>) {
  // Private state
  const instance = computed(() => findInstance(toValue(id)))
  const items = computed(() => instance.value?.items)

  // Private methods
  const { findInstance } = useCommandStore()

  // Public methods
  function nextItem() {
    if (items.value) {
      const index = items.value.indexOf(activeItem.value || '')
      activeItem.value = items.value[index + 1] || items.value[0]
    }
  }

  function prevItem() {
    if (items.value) {
      const index = items.value.indexOf(activeItem.value || '')
      activeItem.value =
        items.value[index - 1] || items.value[items.value.length - 1]
    }
  }

  function selectItem(id: string) {
    activeItem.value = id
  }

  return {
    nextItem,
    prevItem,
    selectItem,
    activeItem,
  }
}
