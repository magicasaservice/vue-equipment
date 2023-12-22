import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import {
  MagicConsentPlugin,
  MagicMarqueePlugin,
  MagicModalPlugin,
  MagicNoisePlugin,
  MagicPlayerPlugin,
  MagicScrollPlugin,
  MagicToastPlugin,
} from '@maas/vue-equipment/plugins'

import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(MagicConsentPlugin)
    app.use(MagicMarqueePlugin)
    app.use(MagicModalPlugin)
    app.use(MagicNoisePlugin)
    app.use(MagicPlayerPlugin)
    app.use(MagicScrollPlugin)
    app.use(MagicToastPlugin)
  },
}
