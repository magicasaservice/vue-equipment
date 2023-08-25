import { ref } from 'vue'
import type { ToastInstance } from '../types/index'

let toastStore = ref<ToastInstance[]>([])

export function useToastStore() {
  // Private methods
  function createInstance(id: string) {
    const instance: ToastInstance = {
      id: id,
      toasts: [],
      add: function (id: string) {
        this.toasts.push(id)
      },
      remove: function (id: string) {
        this.toasts = this.toasts.filter((toast) => toast !== id)
      },
    }
    return instance
  }

  // Public methods
  function addInstanceToStore(id: string) {
    const instance = createInstance(id)
    toastStore.value.push(instance)
  }

  function removeInstanceFromStore(id: string) {
    toastStore.value = toastStore.value.filter(
      (instance: ToastInstance) => instance.id !== id,
    )
  }

  function findInstance(id: string) {
    return toastStore.value.find(
      (instance: ToastInstance) => instance.id === id,
    )
  }

  return {
    toastStore,
    findInstance,
    addInstanceToStore,
    removeInstanceFromStore,
  }
}
