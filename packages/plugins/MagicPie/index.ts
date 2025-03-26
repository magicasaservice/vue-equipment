import MagicPie from './src/components/MagicPie.vue'
import { useMagicPie } from './src/composables/useMagicPie'

import type { App, Plugin } from 'vue'
import type { MagicPieOptions } from './src/types'

const MagicPiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicPie', MagicPie)
  },
}

export { MagicPiePlugin, MagicPie, useMagicPie }
export type { MagicPieOptions }
