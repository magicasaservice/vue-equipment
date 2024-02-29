import type { DrawerOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<DrawerOptions> = {
  position: 'bottom',
  backdrop: true,
  focusTrap: {
    initialFocus: false,
    setReturnFocus: false,
  },
  scrollLock: true,
  scrollLockPadding: true,
  preventZoom: true,
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    content: 'magic-drawer--content',
    backdrop: 'magic-drawer--backdrop',
  },
  threshold: {
    lock: 0,
    distance: 150,
    momentum: 1,
  },
  tag: 'dialog',
  keys: ['Escape'],
  beforeMount: {
    open: false,
    animate: false,
  },
  snap: {
    points: [1],
    duration: 200,
    initial: 1,
  },
  canClose: true,
}

type DefaultOptions = typeof defaultOptions

export { defaultOptions, type DefaultOptions }
