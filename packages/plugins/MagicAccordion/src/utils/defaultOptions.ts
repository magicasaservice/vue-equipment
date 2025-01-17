import type { MagicAccordionOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicAccordionOptions> = {
  mode: 'single',
  transition: 'magic-accordion',
  disabled: false,
}

export { defaultOptions }
