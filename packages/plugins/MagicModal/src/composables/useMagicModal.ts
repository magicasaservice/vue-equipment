import { computed, toValue, type MaybeRef } from 'vue'
import { useModalStore } from './private/useModalStore'

export function useMagicModal(id: MaybeRef<string>) {
  // Private methods
  const { modalStore, addInstance, removeInstance } = useModalStore()

  // Public state
  const isActive = computed(() => modalStore.value.includes(toValue(id)))

  // Public methods
  function open() {
    addInstance(toValue(id))
  }

  function close() {
    removeInstance(toValue(id))
  }

  return {
    isActive,
    open,
    close,
  }
}
