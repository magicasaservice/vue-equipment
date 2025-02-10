import MagicMenuFloat from './src/components/MagicMenuFloat.vue'
import MagicMenuContent from './src/components/MagicMenuContent.vue'
import MagicMenuChannel from './src/components/MagicMenuChannel.vue'
import MagicMenuItem from './src/components/MagicMenuItem.vue'
import MagicMenuProvider from './src/components/MagicMenuProvider.vue'
import MagicMenuRemote from './src/components/MagicMenuRemote.vue'
import MagicMenuTrigger from './src/components/MagicMenuTrigger.vue'
import MagicMenuView from './src/components/MagicMenuView.vue'

import { useMagicMenu } from './src/composables/useMagicMenu'

import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuViewActive,
  MagicMenuItemId,
  MagicMenuItemActive,
  MagicMenuParentTree,
  MagicMenuChannelId,
  MagicMenuChannelActive,
  MagicMenuContentId,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'
import type { MagicMenuOptions } from './src/types/index'

const MagicMenuPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicMenuFloat', MagicMenuFloat)
    app.component('MagicMenuContent', MagicMenuContent)
    app.component('MagicMenuChannel', MagicMenuChannel)
    app.component('MagicMenuItem', MagicMenuItem)
    app.component('MagicMenuProvider', MagicMenuProvider)
    app.component('MagicMenuRemote', MagicMenuRemote)
    app.component('MagicMenuTrigger', MagicMenuTrigger)
    app.component('MagicMenuView', MagicMenuView)
  },
}

export {
  MagicMenuPlugin,
  useMagicMenu,
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuViewActive,
  MagicMenuItemId,
  MagicMenuItemActive,
  MagicMenuParentTree,
  MagicMenuChannelId,
  MagicMenuChannelActive,
  MagicMenuContentId,
}

export type { MagicMenuOptions }
