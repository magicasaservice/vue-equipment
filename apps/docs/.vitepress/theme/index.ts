import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'

import ProseTable from './components/ProseTable.vue'
import ComponentPreview from './components/ComponentPreview.vue'

import * as VueEquipmentPlugins from '@maas/vue-equipment/plugins'
import * as Mirror from '@maas/mirror/vue'

import './styles/main.css'
import './styles/custom.css'
import './styles/tailwind.css'

import 'fonts/mirage/stylesheet.css'
import 'fonts/index/stylesheet.css'

import '@maas/mirror/css/index.css'

import '../../../../.maas/tokens/css/application.css'

import '../../../../.maas/tokens/css/component/badge.css'
import '../../../../.maas/tokens/css/component/button.css'
import '../../../../.maas/tokens/css/component/checkbox.css'
import '../../../../.maas/tokens/css/component/menu-item.css'
import '../../../../.maas/tokens/css/component/menu-box.css'

import '../../../../.maas/tokens/css/theme/vue-equipment/light/application.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/dark/application.css'

import '../../../../.maas/tokens/css/theme/vue-equipment/light/component/badge.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/light/component/button.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/light/component/checkbox.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/light/component/menu-item.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/light/component/menu-box.css'

import '../../../../.maas/tokens/css/theme/vue-equipment/dark/component/badge.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/dark/component/button.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/dark/component/checkbox.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/dark/component/menu-item.css'
import '../../../../.maas/tokens/css/theme/vue-equipment/dark/component/menu-box.css'

import './styles/tailwind.css'

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }) {
    app.component('ProseTable', ProseTable)
    app.component('ComponentPreview', ComponentPreview)

    for (const plugin in VueEquipmentPlugins) {
      // Filter out composables, symbols, etc
      if (plugin.includes('Plugin')) {
        app.use(VueEquipmentPlugins[plugin])
      }
    }
    for (const component in Mirror) {
      // Filter out props, default, etc
      if (!component.includes('Props')) {
        app.component(component, Mirror[component])
      }
    }
  },
}
