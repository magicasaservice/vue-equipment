import type { DrawerDefaultOptions } from '../types'

const defaultOptions: DrawerDefaultOptions = {
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
    content: 'magic-drawer-content',
    backdrop: 'magic-drawer-backdrop',
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
  },
  keyListener: {
    close: ['Escape'],
  },
  enableMousewheel: false,
  preventZoom: true,
  preventDragClose: false,
  disabled: false,
}

export { defaultOptions }
