import type { App, Plugin } from 'vue'

import MagicMarquee from './src/components/MagicMarquee.vue'
import { useMagicMarquee } from './src/composables/useMagicMarquee'

import type { MagicMarqueeOptions } from './src/types'

const MagicMarqueePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicMarquee', MagicMarquee)
  },
}

export { MagicMarqueePlugin, useMagicMarquee }
export type { MagicMarqueeOptions }
