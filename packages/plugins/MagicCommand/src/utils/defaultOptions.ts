import type { CommandDefaultOptions } from '../types'

const defaultOptions: CommandDefaultOptions = {
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

export { defaultOptions }
