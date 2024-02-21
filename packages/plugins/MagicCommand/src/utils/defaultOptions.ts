import type { CommandOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<CommandOptions> = {
  backdrop: true,
  focusTrap: true,
  scrollLock: true,
  scrollLockPadding: true,
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    content: 'magic-command--content',
    backdrop: 'magic-command--backdrop',
  },
  tag: 'dialog',
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
