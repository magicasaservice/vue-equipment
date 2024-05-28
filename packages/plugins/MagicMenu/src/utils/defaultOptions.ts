import type { MagicMenuOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicMenuOptions> = {
  mode: 'menubar',
  transition: {
    initial: 'magic-menu-content__initial',
    final: 'magic-menu-content__final',
    nested: 'magic-menu-content__nested',
  },
}

export { defaultOptions }
