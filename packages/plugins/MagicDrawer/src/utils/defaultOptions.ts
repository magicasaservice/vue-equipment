import type { MagicDrawerOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<MagicDrawerOptions> & {
  scrollLock: RequireAll<MagicDrawerOptions['scrollLock']>
  threshold: RequireAll<MagicDrawerOptions['threshold']>
  animation: RequireAll<MagicDrawerOptions['animation']>
  initial: RequireAll<MagicDrawerOptions['initial']>
  keyListener: RequireAll<MagicDrawerOptions['keyListener']>
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
  preventZoom: true,
  preventDragClose: false,
  disabled: false,
}

export { defaultOptions, type DefaultOptions }
