import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import * as VueEquipmentPlugins from '@maas/vue-equipment/plugins'

import 'uno.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }) {
    for (const plugin in VueEquipmentPlugins) {
      // Filter out composables, symbols, etc
      if (plugin.includes('Plugin')) {
        app.use(VueEquipmentPlugins[plugin])
      }
    }
  },
}
