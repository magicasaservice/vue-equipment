import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'

import ProseTable from './components/ProseTable.vue'
import ComponentPreview from './components/ComponentPreview.vue'

// Import plugins individually
import { MagicAccordionPlugin } from '@maas/vue-equipment/plugins/MagicAccordion'
import { MagicCommandPlugin } from '@maas/vue-equipment/plugins/MagicCommand'
import { MagicCookiePlugin } from '@maas/vue-equipment/plugins/MagicCookie'
import { MagicDraggablePlugin } from '@maas/vue-equipment/plugins/MagicDraggable'
import { MagicDrawerPlugin } from '@maas/vue-equipment/plugins/MagicDrawer'
import { MagicMarqueePlugin } from '@maas/vue-equipment/plugins/MagicMarquee'
import { MagicMenuPlugin } from '@maas/vue-equipment/plugins/MagicMenu'
import { MagicModalPlugin } from '@maas/vue-equipment/plugins/MagicModal'
import { MagicNoisePlugin } from '@maas/vue-equipment/plugins/MagicNoise'
import { MagicPiePlugin } from '@maas/vue-equipment/plugins/MagicPie'
import { MagicPlayerPlugin } from '@maas/vue-equipment/plugins/MagicPlayer'
import { MagicScrollPlugin } from '@maas/vue-equipment/plugins/MagicScroll'
import { MagicToastPlugin } from '@maas/vue-equipment/plugins/MagicToast'

import * as Mirror from '@maas/mirror/vue'

import './styles/main.css'
import './styles/custom.css'
import './styles/tailwind.css'

import 'fonts/mirage/stylesheet.css'
import 'fonts/index/stylesheet.css'

import '@maas/mirror/css/index.css'

import '../../../../.maas/tokens/css/application.css'
import '../../../../.maas/tokens/css/theme/dark/application.css'

import '../../../../.maas/tokens/css/component/badge.css'
import '../../../../.maas/tokens/css/component/button.css'
import '../../../../.maas/tokens/css/component/checkbox.css'
import '../../../../.maas/tokens/css/component/menu-item.css'
import '../../../../.maas/tokens/css/component/menu-box.css'

import '../../../../.maas/tokens/css/theme/dark/component/badge.css'
import '../../../../.maas/tokens/css/theme/dark/component/button.css'
import '../../../../.maas/tokens/css/theme/dark/component/checkbox.css'
import '../../../../.maas/tokens/css/theme/dark/component/menu-item.css'
import '../../../../.maas/tokens/css/theme/dark/component/menu-box.css'

import './styles/tailwind.css'

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }) {
    app.component('ProseTable', ProseTable)
    app.component('ComponentPreview', ComponentPreview)

    // Install all plugins
    const plugins = [
      MagicAccordionPlugin,
      MagicCommandPlugin,
      MagicCookiePlugin,
      MagicDraggablePlugin,
      MagicDrawerPlugin,
      MagicMarqueePlugin,
      MagicMenuPlugin,
      MagicModalPlugin,
      MagicNoisePlugin,
      MagicPiePlugin,
      MagicPlayerPlugin,
      MagicScrollPlugin,
      MagicToastPlugin,
    ]

    plugins.forEach((plugin) => {
      app.use(plugin)
    })

    for (const component in Mirror) {
      // Filter out props, default, etc
      if (!component.includes('Props')) {
        app.component(component, Mirror[component])
      }
    }
  },
}
