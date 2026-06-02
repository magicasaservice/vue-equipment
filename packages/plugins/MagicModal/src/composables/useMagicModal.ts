import { computed, toValue, type MaybeRef } from 'vue'
import { useModalState } from './private/useModalState'
import type { MagicModalOptions } from '../types/index'

export function useMagicModal(id: MaybeRef<string>, options?: MagicModalOptions) {
  const { initializeState } = useModalState(toValue(id))
  const state = initializeState(options)

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
    state,
    open,
    close,
  }
}

export type UseMagicModalReturn = ReturnType<typeof useMagicModal>
