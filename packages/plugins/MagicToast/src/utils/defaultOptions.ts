import type { ToastOptions } from '../types/index'
import type { RequireAll } from 'utils'

const defaultOptions: RequireAll<ToastOptions> = {
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    list: 'magic-toast--list',
  },
  layout: {
    expand: 'click',
    max: 4,
  },
}

export { defaultOptions }
