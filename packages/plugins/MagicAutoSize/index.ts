import type { App, Plugin } from 'vue'

import MagicAutoSize from './src/components/MagicAutoSize.vue'

const MagicAutoSizePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicAutoSize', MagicAutoSize)
  },
}

export { MagicAutoSizePlugin, MagicAutoSize }
