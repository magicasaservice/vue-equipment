import { computed, toValue, type MaybeRef } from 'vue'
import { useModalStore } from './private/useModalStore'

export function useMagicModal(id: MaybeRef<string>) {
  // Private functions
  const { modalStore, addInstance, removeInstance } = useModalStore()

  // Public state
  const isActive = computed(() => modalStore.value.includes(toValue(id)))

  // Public functions
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
