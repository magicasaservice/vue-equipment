import DefaultTheme from 'vitepress/theme'
import {
  MagicConsentPlugin,
  MagicMarqueePlugin,
  MagicModalPlugin,
  MagicPlayerPlugin,
  MagicScrollPlugin,
  MagicToastPlugin,
} from 'plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicConsentPlugin)
    app.use(MagicMarqueePlugin)
    app.use(MagicModalPlugin)
    app.use(MagicPlayerPlugin)
    app.use(MagicScrollPlugin)
    app.use(MagicToastPlugin)
  },
}
