import type { MagicMenuOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicMenuOptions> = {
  mode: 'menubar',
  debug: false,
  transition: {
    content: {
      default: 'magic-menu-content--default',
      nested: 'magic-menu-content--nested',
    },
    channel: 'magic-menu-channel',
  },
}

export { defaultOptions }
