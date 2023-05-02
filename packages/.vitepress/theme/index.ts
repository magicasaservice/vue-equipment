import DefaultTheme from 'vitepress/theme'
import { MagicScroll } from '@maas/vue-equipment/plugins'

import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(MagicScroll)
  },
}
