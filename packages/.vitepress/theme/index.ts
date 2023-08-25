import DefaultTheme from 'vitepress/theme'
import {
  MagicMarquee,
  MagicModal,
  MagicPlayer,
  MagicScroll,
  MagicToast,
} from 'plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicMarquee)
    app.use(MagicModal)
    app.use(MagicPlayer)
    app.use(MagicScroll)
    app.use(MagicToast)
  },
}
