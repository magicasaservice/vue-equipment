import type { RequiredMagicMenuOptions } from '../types'

const defaultOptions: RequiredMagicMenuOptions = {
  mode: 'menubar',
  debug: false,
  transition: {
    content: {
      default: '',
      nested: 'magic-menu-content--fade',
    },
    channel: 'magic-menu-channel',
  },
}

export { defaultOptions }
