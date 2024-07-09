import type { MagicMenuOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: Omit<
  RequireAllNested<MagicMenuOptions>,
  'scrollLock' | 'floating' | 'delay'
> = {
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
