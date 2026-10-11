import DefaultTheme from 'vitepress/theme-without-fonts'
// Import plugins individually
import { MagicAccordionPlugin } from '@maas/vue-equipment/plugins/MagicAccordion'
import { MagicCarouselPlugin } from '@maas/vue-equipment/plugins/MagicCarousel'
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
import { MagicTrayPlugin } from '@maas/vue-equipment/plugins/MagicTray'
import * as Mirror from '@maas/mirror/vue'
import * as MirrorCompat from 'mirror-compat'
import Layout from './Layout.vue'
import ProseTable from './components/ProseTable.vue'
import ComponentPreview from './components/ComponentPreview.vue'
import type { EnhanceAppContext } from 'vitepress'
import type { Component } from 'vue'

import './styles/main.css'
import './styles/custom.css'
import './styles/tailwind.css'

import 'fonts/mirage/stylesheet.css'
import 'fonts/index/stylesheet.css'

import '../../../../.maas/tokens/css/application.css'
import '../../../../.maas/tokens/css/theme/dark/application.css'
import './styles/tailwind.css'

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }: EnhanceAppContext) {
    app.component('ProseTable', ProseTable)
    app.component('ComponentPreview', ComponentPreview)

    // Install all plugins
    const plugins = [
      MagicAccordionPlugin,
      MagicCarouselPlugin,
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
      MagicTrayPlugin,
    ]

    plugins.forEach((plugin) => {
      app.use(plugin)
    })

    // Mirror's own exports register under their v2 names. The compatibility
    // wrappers register after them under the `M*` names v2 dropped, which is
    // what the `<m-*>` tags in the prose and the layout resolve against.
    const registries = [Mirror, MirrorCompat] as Record<string, unknown>[]

    for (const registry of registries) {
      for (const [name, exported] of Object.entries(registry)) {
        // A namespace object of parts is not a component, and neither is a
        // composable or an error class. Registering one only fails at render.
        const isComponent =
          typeof exported === 'function' ||
          (typeof exported === 'object' &&
            exported !== null &&
            ('render' in exported ||
              'setup' in exported ||
              '__file' in exported))

        if (!name.includes('Props') && isComponent) {
          app.component(name, exported as Component)
        }
      }
    }
  },
}
