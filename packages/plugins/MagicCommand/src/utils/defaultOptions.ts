import type { MagicCommandOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicCommandOptions> = {
  debug: false,
  transition: {
    content: {
      default: '',
      nested: 'magic-command-content--fade',
    },
    channel: 'magic-command-channel',
  },
  keyListener: {
    open: ['Cmd+k'],
    close: ['Escape'],
    next: ['ArrowDown'],
    prev: ['ArrowUp'],
  },
  loop: false,
}

type DefaultOptions = typeof defaultOptions

export { defaultOptions, type DefaultOptions }
