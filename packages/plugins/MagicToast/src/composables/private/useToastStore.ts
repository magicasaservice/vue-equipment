import { ref } from 'vue'
import { useToastInternalApi } from './useToastInternalApi'
import type { MagicToastInstance, AddToastArgs } from '../../types'

const toastStore = ref<MagicToastInstance[]>([])

export function useToastStore() {
  // Private methods
  const { addToast } = useToastInternalApi()

  function createInstance(id: string): MagicToastInstance {
    const instance: MagicToastInstance = {
      id: id,
      toasts: [],
      add: function (args: AddToastArgs) {
        return addToast(args, this)
      },
      remove: function (id: string) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id)
      },
    }
    return instance
  }

  // Public methods
  function findInstance(id: string): MagicToastInstance | undefined {
    const instance = toastStore.value.find(
      (instance: MagicToastInstance) => instance.id === id
    )

    return instance
  }

  function addInstance(id: string): MagicToastInstance {
    const instance = createInstance(id)
    toastStore.value.push(instance)
    return instance
  }

  function removeInstance(id: string) {
    toastStore.value = toastStore.value.filter(
      (instance: MagicToastInstance) => instance.id !== id
    )
  }

  return {
    toastStore,
    findInstance,
    addInstance,
    removeInstance,
  }
}
