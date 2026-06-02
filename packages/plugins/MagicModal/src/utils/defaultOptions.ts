import type { MagicModalOptions } from '../types'

const defaultOptions: Required<MagicModalOptions> = {
  backdrop: true,
  tag: 'dialog',
  focusTrap: {
    initialFocus: false,
    setReturnFocus: false,
    allowOutsideClick: true,
  },
  scrollLock: { padding: true },
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: {
    content: 'magic-modal-content',
    backdrop: 'magic-modal-backdrop',
  },
  keyListener: {
    close: ['Escape'],
  },
}

export { defaultOptions }
