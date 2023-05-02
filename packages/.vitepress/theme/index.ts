import DefaultTheme from 'vitepress/theme'
import { MagicScroll } from 'plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicScroll)
  },
}
