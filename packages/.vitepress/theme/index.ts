import DefaultTheme from 'vitepress/theme'
import { MagicScroll, MagicPlayer } from 'plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicScroll)
    app.use(MagicPlayer)
  },
}
