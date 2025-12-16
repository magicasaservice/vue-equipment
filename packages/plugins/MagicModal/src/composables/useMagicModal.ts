import { computed, toValue, type MaybeRef } from 'vue'
import { useModalState } from './private/useModalState'

export function useMagicModal(id: MaybeRef<string>) {
  const { initializeState } = useModalState(id)
  const state = initializeState()

  // Public state
  const isActive = computed(() => state.active)

  // Public functions
  function open() {
    state.active = true
  }

  function close() {
    state.active = false
  }

  return {
    isActive,
    open,
    close,
  }
}
