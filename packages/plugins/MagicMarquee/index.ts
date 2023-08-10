import type { App, Plugin } from 'vue'

import MagicMarqueeComponent from './src/components/MagicMarquee.vue'

const MagicMarquee: Plugin = {
  install: (app: App) => {
    app.component('MagicMarquee', MagicMarqueeComponent)
  },
}

export { MagicMarquee }
