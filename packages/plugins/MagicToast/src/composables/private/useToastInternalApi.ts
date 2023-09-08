import { crypto } from '@maas/vue-equipment/utils'
import type { ToastInstance, Toast, AddArgs } from './../../types'

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
    const id = crypto.randomUUID()
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
