import type { MagicModalOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicModalOptions> = {
  backdrop: true,
  tag: 'dialog',
  focusTrap: {
    initialFocus: false,
    setReturnFocus: false,
    allowOutsideClick: true,
  },
  scrollLock: { padding: true },
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: {
    content: 'magic-modal--content',
    backdrop: 'magic-modal--backdrop',
  },
  keyListener: {
    close: ['Escape'],
  },
}

export { defaultOptions }
