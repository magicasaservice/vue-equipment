import type { MagicCommandOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicCommandOptions> = {
  debug: false,
  transition: {
    content: 'magic-command-content',
  },
  keyListener: {
    open: ['Cmd+k'],
    close: ['Escape'],
    next: ['ArrowDown'],
    prev: ['ArrowUp'],
    enter: ['Enter'],
  },
  loop: false,
}

type DefaultOptions = typeof defaultOptions

export { defaultOptions, type DefaultOptions }
