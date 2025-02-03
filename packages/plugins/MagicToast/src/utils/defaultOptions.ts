import type { MagicToastOptions } from '../types/index'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicToastOptions> = {
  position: 'bottom-center',
  teleport: {
    target: 'body',
    disabled: false,
  },
  transition: 'magic-toast',
  layout: {
    expand: 'click',
    max: 3,
  },
  initial: {
    expanded: false,
  },
}

export { defaultOptions }
