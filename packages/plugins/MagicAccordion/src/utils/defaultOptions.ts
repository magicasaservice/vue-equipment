import type { MagicAccordionOptions } from '../types'
import { easeOutQuad, type RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicAccordionOptions> = {
  mode: 'single',
  transition: 'magic-accordion',
  disabled: false,
  animation: {
    duration: 200,
    easing: easeOutQuad,
  },
}

export { defaultOptions }
