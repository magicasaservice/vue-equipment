import DefaultTheme from 'vitepress/theme'
// @ts-ignore
import Layout from './Layout.vue'
import {
  MagicConsentPlugin,
  MagicMarqueePlugin,
  MagicModalPlugin,
  MagicNoisePlugin,
  MagicPlayerPlugin,
  MagicScrollPlugin,
  MagicToastPlugin,
} from 'plugins'

import 'virtual:uno.css'
import '@maas/vue-equipment/utils/css/animations.css'

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
