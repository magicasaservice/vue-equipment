import { computed, toValue, type MaybeRef } from 'vue'
import mitt from 'mitt'
import { uuid } from '@maas/vue-equipment/utils'
import { useModalStore } from './private/useModalStore'
import type { ModalEvents } from '../types'

const emitter = mitt<ModalEvents>()

export function useMagicModal(id?: MaybeRef<string>) {
  // Private state
  const mappedId = computed(() => toValue(id) || uuid())

  // Private methods
  const { modalStore, addInstance, removeInstance } = useModalStore()

  // Public state
  const isActive = computed(() => modalStore.value.includes(mappedId.value))

  // Public methods
  function open() {
    addInstance(mappedId.value)
  }

  function close() {
    removeInstance(mappedId.value)
  }

  return {
    id: mappedId,
    isActive,
    open,
    close,
    emitter,
  }
}
