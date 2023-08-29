import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { ToastInstance, Toast, AddArgs } from '../types/index'

const toastStore = ref<ToastInstance[]>([])

export function useToastStore() {
  function removeToastAfterTimeout(
    id: string,
    duration: number,
    ctx: ToastInstance,
  ) {
    if (duration > 0) {
      setTimeout(() => {
        ctx.remove(id)
      }, duration)
    }
  }

  // Private methods
  function addToast(args: AddArgs, ctx: ToastInstance) {
    const id = uuidv4()
    let { component, props, duration = 0 } = args

    const toast: Toast = {
      component,
      props,
      id,
      remove: () => ctx.remove(id),
    }

    // Add toast to instance
    ctx.toasts.push(toast)

    // Remove toast after duration
    removeToastAfterTimeout(id, duration, ctx)

    return id
  }

  function createInstance(id: string): ToastInstance {
    const instance: ToastInstance = {
      id: id,
      toasts: [],
      add: function (args: AddArgs) {
        return addToast(args, this)
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
    // @ts-ignore
    toastStore.value.push(instance)
    return instance
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
