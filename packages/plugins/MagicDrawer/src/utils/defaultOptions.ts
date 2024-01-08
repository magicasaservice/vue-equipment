import type { DrawerOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<DrawerOptions> = {
  position: 'bottom',
  backdrop: true,
  focusTrap: true,
  scrollLock: true,
  scrollLockPadding: true,
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    content: 'magic-drawer--content',
    backdrop: 'magic-drawer--backdrop',
  },
  tag: 'dialog',
  keys: ['Escape'],
}

export { defaultOptions }
