import type { ModalOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<ModalOptions> = {
  backdrop: true,
  focusTrap: true,
  scrollLock: true,
  scrollLockPadding: true,
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    content: 'magic-modal--content',
    backdrop: 'magic-modal--backdrop',
  },
  tag: 'dialog',
  keys: ['Escape'],
}

export { defaultOptions }
