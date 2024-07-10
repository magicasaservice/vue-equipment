import type { MagicAccordionOptions } from '../types'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAllNested<MagicAccordionOptions> = {
  mode: 'multiple',
  transition: 'magic-accordion',
}

export { defaultOptions }
