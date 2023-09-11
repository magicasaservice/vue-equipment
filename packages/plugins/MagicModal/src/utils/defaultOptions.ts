import type { Options } from '../types/index'

const defaultOptions: Options = {
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
  keys: ['Escape'],
}

export { defaultOptions }
