import type { RequiredMagicAccordionOptions } from '../types'
import { easeOutQuad } from '@maas/vue-equipment/utils'

const defaultOptions: RequiredMagicAccordionOptions = {
  mode: 'single',
  transition: 'magic-accordion',
  disabled: false,
  animation: {
    duration: 200,
    easing: easeOutQuad,
  },
}

export { defaultOptions }
