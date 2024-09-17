import { useId } from 'vue'
import type { ToastInstance, Toast, AddToastArgs } from './../../types'

export function useToastInternalApi() {
  function removeToastAfterTimeout(
    id: string,
    duration: number,
    ctx: ToastInstance
  ) {
    if (duration > 0) {
      setTimeout(() => {
        ctx.remove(id)
      }, duration)
    }
  }

  function addToast(args: AddToastArgs, ctx: ToastInstance) {
    const id = useId() ?? 'magic-toast'
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
