import type { RequiredMagicCommandOptions } from '../types'

const defaultOptions: RequiredMagicCommandOptions = {
  debug: false,
  transition: {
    content: 'magic-command-content',
  },
  keyListener: {
    open: ['Cmd+k', 'Ctrl+k'],
    close: ['Escape'],
    next: ['ArrowDown'],
    prev: ['ArrowUp'],
    enter: ['Enter'],
  },
  loop: false,
}

export { defaultOptions }
