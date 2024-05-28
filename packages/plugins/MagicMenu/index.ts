import MagicMenuFloat from './src/components/MagicMenuFloat.vue'
import MagicMenuContent from './src/components/MagicMenuContent.vue'
import MagicMenuItem from './src/components/MagicMenuItem.vue'
import MagicMenuProvider from './src/components/MagicMenuProvider.vue'
import MagicMenuTrigger from './src/components/MagicMenuTrigger.vue'
import MagicMenuView from './src/components/MagicMenuView.vue'

// import { useMagicMenu } from './src/old/composables/useMagicMenu'

import {
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'

const MagicMenuPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicMenuFloat', MagicMenuFloat)
    app.component('MagicMenuContent', MagicMenuContent)
    app.component('MagicMenuItem', MagicMenuItem)
    app.component('MagicMenuProvider', MagicMenuProvider)
    app.component('MagicMenuTrigger', MagicMenuTrigger)
    app.component('MagicMenuView', MagicMenuView)
  },
}

export {
  MagicMenuPlugin,
  // useMagicMenu,
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
}
