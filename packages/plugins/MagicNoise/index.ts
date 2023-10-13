import type { App, Plugin } from 'vue'

import MagicNoise from './src/components/MagicNoise.vue'

const MagicNoisePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicNoise', MagicNoise)
  },
}

export { MagicNoisePlugin, MagicNoise }
