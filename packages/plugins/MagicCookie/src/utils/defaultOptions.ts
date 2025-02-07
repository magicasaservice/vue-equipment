import type { MagicCookieOptions } from '../types'
import { easeOutQuad, type RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicCookieOptions> = {
  maxAge: 24 * 60 * 60 * 60,
  transition: 'magic-cookie-view',
  animation: {
    duration: 300,
    easing: easeOutQuad,
  },
}

export { defaultOptions }
