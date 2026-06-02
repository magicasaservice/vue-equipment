import type { RequiredMagicToastOptions } from '../types/index'

const defaultOptions: RequiredMagicToastOptions = {
  debug: false,
  position: 'bottom',
  duration: 0,
  scrollLock: {
    padding: true,
  },
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: 'magic-toast',
  layout: {
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
  initial: {
    expanded: false,
  },
}

export { defaultOptions }
