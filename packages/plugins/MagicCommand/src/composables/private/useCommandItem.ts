import { ref, computed, watch, type MaybeRef } from 'vue'
import { useCommandStore } from './useCommandStore'
import { toValue } from '@vueuse/core'

const activeItem = ref<string | undefined>(undefined)
const lastActiveItem = ref<string | undefined>(undefined)
const watcherActive = ref(false)

export function useCommandItem(id: MaybeRef<string>) {
  // Private state
  const instance = computed(() => findInstance(toValue(id)))
  const items = computed(() => instance.value?.items)

  // Private methods
  const { findInstance } = useCommandStore()

  // Public methods
  function nextItem(loop: boolean = false) {
    if (items.value) {
      const index = items.value.indexOf(activeItem.value || '')
      const hasNext = items.value[index + 1] !== undefined

      if (hasNext) {
        selectItem(items.value[index + 1])
      } else if (loop) {
        selectItem(items.value[0])
      }
    }
  }

  function prevItem(loop: boolean = false) {
    if (items.value) {
      const index = items.value.indexOf(activeItem.value || '')
      const hasPrev = items.value[index - 1] !== undefined

      if (hasPrev) {
        selectItem(items.value[index - 1])
      } else if (loop) {
        selectItem(items.value[items.value.length - 1])
      }
    }
  }

  function selectItem(id: string) {
    activeItem.value = id
  }

  function selectLastItem() {
    activeItem.value = lastActiveItem.value
  }

  if (!watcherActive.value) {
    watcherActive.value = true
    watch(activeItem, (_newItem, oldItem) => {
      if (oldItem) lastActiveItem.value = oldItem
    })
  }

  return {
    nextItem,
    prevItem,
    selectItem,
    selectLastItem,
    activeItem,
    lastActiveItem,
  }
}
