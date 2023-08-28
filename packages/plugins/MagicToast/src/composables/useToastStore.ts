import { ref, defineAsyncComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { ToastInstance, Toast, AddArgs } from '../types/index'

let toastStore = ref<ToastInstance[]>([])

export function useToastStore() {
  // Private methods
  function createInstance(id: string) {
    const instance: ToastInstance = {
      id: id,
      toasts: [],
      add: async function (args: AddArgs) {
        const id = uuidv4()
        let { component, props, duration = 0 } = args

        // TODO: add type guard
        if (typeof component === 'string') {
          component = defineAsyncComponent(() => import(component as string))
        }

        const toast = {
          component,
          props,
          id,
          remove: () => this.remove(id),
        }

        // Add toast to instance
        this.toasts.push(toast)

        // Remove toast after duration
        if (duration > 0) {
          setTimeout(() => {
            this.remove(id)
          }, duration)
        }

        return id
      },
      remove: function (id: string) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id)
      },
    }
    return instance
  }

  // Public methods
  function findInstance(id: string) {
    return toastStore.value.find(
      (instance: ToastInstance) => instance.id === id,
    )
  }

  function addInstance(id: string) {
    const instance = createInstance(id)
    toastStore.value.push(instance)
  }

  function removeInstance(id: string) {
    toastStore.value = toastStore.value.filter(
      (instance: ToastInstance) => instance.id !== id,
    )
  }

  return {
    toastStore,
    findInstance,
    addInstance,
    removeInstance,
  }
}
