import type { CommandOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<CommandOptions> = {
  keys: {
    open: ['Cmd+k'],
    close: ['Escape'],
    next: ['ArrowDown'],
    prev: ['ArrowUp'],
  },
  loop: false,
}

type DefaultOptions = typeof defaultOptions

export { defaultOptions, type DefaultOptions }
