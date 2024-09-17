import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import * as VueEquipmentPlugins from '@maas/vue-equipment/plugins'
import * as Mirror from '@maas/mirror/vue'

import './styles/style.css'
import 'fonts/mirage/stylesheet.css'
import 'fonts/interface/stylesheet.css'
import 'fonts/index/stylesheet.css'
import '@maas/mirror/css/index.css'
import '../../../../.maas/tokens/css/components/index.css'
import '../../../../.maas/tokens/css/theme/dark/components/index.css'
import '../../../../.maas/tokens/css/application.css'
import '../../../../.maas/tokens/css/theme/dark/application.css'
import './styles/tailwind.css'

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
    for (const component in Mirror) {
      // Filter out props, default, etc
      if (!component.includes('Props')) {
        app.component(component)
      }
    }
  },
}
