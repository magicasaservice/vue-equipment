import type { DefaultOptions } from '../types/index'

const defaultOptions: DefaultOptions = {
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
