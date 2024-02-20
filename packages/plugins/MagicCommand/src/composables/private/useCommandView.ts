import { ref, computed, type MaybeRef } from 'vue'
import { useCommandStore } from './useCommandStore'
import { toValue } from '@vueuse/core'

const activeView = ref<string | undefined>(undefined)

export function useCommandView(id: MaybeRef<string>) {
  // Private state
  const instance = computed(() => findInstance(toValue(id)))
  const items = computed(() => instance.value?.items)

  // Private methods
  const { findInstance } = useCommandStore()

  // Public methods
  function nextView() {
    if (items.value) {
      const index = items.value.indexOf(activeView.value || '')
      activeView.value = items.value[index + 1] || items.value[0]
    }
  }

  function prevView() {
    if (items.value) {
      const index = items.value.indexOf(activeView.value || '')
      activeView.value =
        items.value[index - 1] || items.value[items.value.length - 1]
    }
  }

  function selectView(id: string) {
    activeView.value = id
  }

  return {
    nextView,
    prevView,
    selectView,
    activeView,
  }
}
