import type { App, Plugin } from 'vue'

import MagicNoise from './src/components/MagicNoise.vue'
import { useNoiseApi } from './src/composables/private/useNoiseApi'

const MagicNoisePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicNoise', MagicNoise)
  },
}

export { MagicNoisePlugin, MagicNoise, useNoiseApi }
