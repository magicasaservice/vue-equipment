import DefaultTheme from 'vitepress/theme'
import {
  MagicConsentPlugin,
  MagicMarqueePlugin,
  MagicModalPlugin,
  MagicNoisePlugin,
  MagicPlayerPlugin,
  MagicScrollPlugin,
  MagicToastPlugin,
} from 'plugins'

import 'uno.css'
import '../../../dist/utils/css/animations.css'

export default {
  ...DefaultTheme,
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
