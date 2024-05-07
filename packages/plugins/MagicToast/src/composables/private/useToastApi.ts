import { uuid } from '@maas/vue-equipment/utils'
import { computed, toValue, type MaybeRef } from 'vue'
import { useToastStore } from './useToastStore'
import { useMagicToast } from '../useMagicToast'

export function useToastApi(id?: MaybeRef<string>) {
  const { findInstance, addInstance, removeInstance } = useToastStore()

  // Private state
  const mappedId = computed(() => toValue(id) || uuid())

  // Private methods
  const { clear } = useMagicToast(mappedId)

  // Public methods
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

  return {
    initialize,
    destroy,
  }
}
