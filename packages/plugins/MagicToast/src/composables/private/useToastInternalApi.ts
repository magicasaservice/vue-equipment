import { uuid } from '@maas/vue-equipment/utils'
import type {
  MagicToastInstance,
  MagicToast,
  AddToastArgs,
} from './../../types'

export function useToastInternalApi() {
  function removeToastAfterTimeout(
    id: string,
    duration: number,
    ctx: MagicToastInstance
  ) {
    if (duration > 0) {
      setTimeout(() => {
        ctx.remove(id)
      }, duration)
    }
  }

  function addToast(args: AddToastArgs, ctx: MagicToastInstance) {
    const id = uuid()
    let { component, props, duration = 0 } = args

    const toast: MagicToast = {
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
