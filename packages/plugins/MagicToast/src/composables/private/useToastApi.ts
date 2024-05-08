import { toValue, type MaybeRef } from 'vue'
import { useToastStore } from './useToastStore'
import { useMagicToast } from '../useMagicToast'

export function useToastApi(id: MaybeRef<string>) {
  const { findInstance, addInstance, removeInstance } = useToastStore()

  // Private methods
  const { clear } = useMagicToast(toValue(id))

  // Public methods
  function initialize() {
    const mappedId = toValue(id)
    if (!findInstance(mappedId)) {
      return addInstance(mappedId)
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
