import type { DrawerOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<DrawerOptions> & {
  scrollLock: RequireAll<DrawerOptions['scrollLock']>
  threshold: RequireAll<DrawerOptions['threshold']>
  animation: RequireAll<DrawerOptions['animation']>
  initial: RequireAll<DrawerOptions['initial']>
  keyListener: RequireAll<DrawerOptions['keyListener']>
}

const defaultOptions: DefaultOptions = {
  position: 'bottom',
  backdrop: true,
  tag: 'dialog',
  focusTrap: {
    initialFocus: false,
    setReturnFocus: false,
    allowOutsideClick: true,
  },
  scrollLock: { padding: true },
  snapPoints: [1],
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: {
    content: 'magic-drawer--content',
    backdrop: 'magic-drawer--backdrop',
  },
  threshold: {
    lock: 0,
    distance: 128,
    momentum: 1,
  },
  animation: {
    snap: {
      duration: 300,
    },
  },
  initial: {
    open: false,
    transition: false,
    snapPoint: 1,
  },
  keyListener: {
    close: ['Escape'],
  },
  enableMousewheel: false,
  preventZoom: false,
  preventDragClose: false,
  disabled: false,
}

export { defaultOptions, type DefaultOptions }
