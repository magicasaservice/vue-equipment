import type { ToastDefaultOptions } from '../types/index'

const defaultOptions: ToastDefaultOptions = {
  position: 'bottom-center',
  scrollLock: {
    padding: true,
  },
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: 'magic-toast',
  layout: {
    perspective: true,
    expand: 'click',
    max: 3,
  },
  threshold: {
    lock: 8,
    distance: 32,
    momentum: 1,
  },
  animation: {
    snap: {
      duration: 300,
    },
  },
}

export { defaultOptions }
