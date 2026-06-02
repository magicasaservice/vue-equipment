import type { RequiredMagicCookieOptions } from '../types'
import { easeOutQuad } from '@maas/vue-equipment/utils'

const defaultOptions: RequiredMagicCookieOptions = {
  maxAge: 24 * 60 * 60 * 60,
  transition: 'magic-cookie-view',
  animation: {
    duration: 300,
    easing: easeOutQuad,
  },
}

export { defaultOptions }
