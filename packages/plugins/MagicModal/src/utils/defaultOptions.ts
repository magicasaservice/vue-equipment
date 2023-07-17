import type { DefaultOptions } from '../types/index'

const defaultOptions: DefaultOptions = {
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
}

export { defaultOptions }
