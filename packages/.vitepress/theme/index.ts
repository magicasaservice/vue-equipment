import DefaultTheme from 'vitepress/theme'
import { MagicScroll, MagicPlayer, MagicModal, MagicMarquee } from 'plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicScroll)
    app.use(MagicPlayer)
    app.use(MagicModal)
    app.use(MagicMarquee)
  },
}
