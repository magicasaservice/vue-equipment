import type { MagicCookieOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicCookieOptions> = {
  maxAge: 24 * 60 * 60 * 60,
  transition: {
    view: 'magic-cookie-view',
  },
}

export { defaultOptions }
