import { v4 as uuidv4 } from 'uuid'
import { defineAsyncComponent } from 'vue'
import type { ToastInstance, Toast, AddArgs } from './../types'

export function useToastInternalApi() {
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

    // Remove toast if duration is set
    removeToastAfterTimeout(id, duration, ctx)

    return id
  }

  return {
    addToast,
  }
}
