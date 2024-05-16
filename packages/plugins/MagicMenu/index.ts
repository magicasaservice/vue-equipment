import MagicMenuBar from './src/components/MagicMenuBar.vue'
import MagicMenuBarItem from './src/components/MagicMenuBarItem.vue'
import MagicMenuFloat from './src/components/MagicMenuFloat.vue'
import MagicMenuItem from './src/components/MagicMenuItem.vue'
import MagicMenuProvider from './src/components/MagicMenuProvider.vue'
import MagicMenuView from './src/components/MagicMenuView.vue'

import { useMagicMenu } from './src/composables/useMagicMenu'

import {
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'

const MagicMenuPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicMenuBar', MagicMenuBar)
    app.component('MagicMenuBarItem', MagicMenuBarItem)
    app.component('MagicMenuFloat', MagicMenuFloat)
    app.component('MagicMenuItem', MagicMenuItem)
    app.component('MagicMenuProvider', MagicMenuProvider)
    app.component('MagicMenuView', MagicMenuView)
  },
}

export {
  MagicMenuPlugin,
  useMagicMenu,
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
}
