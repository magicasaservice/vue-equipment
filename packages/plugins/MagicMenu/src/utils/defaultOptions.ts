import type { MagicMenuOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicMenuOptions> = {
  mode: 'menubar',
  transition: {
    initial: 'magic-menu-content--initial',
    final: 'magic-menu-content--final',
    nested: 'magic-menu-content--nested',
  },
}

export { defaultOptions }
