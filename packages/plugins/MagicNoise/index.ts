import MagicNoise from './src/components/MagicNoise.vue'

import type { App, Plugin } from 'vue'
import type { MagicNoiseOptions } from './src/types'

const MagicNoisePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicNoise', MagicNoise)
  },
}

export { MagicNoisePlugin, MagicNoise }
export type { MagicNoiseOptions }
