import type { ToRefs } from 'vue'

export interface MagicMenuItem {
  id: string
  active: boolean
}

export interface MagicMenuView {
  id: string
  active: boolean
  items: MagicMenuItem[]
  parent: { item: string; views: string[] }
}

export interface MagicMenuState {
  id: string
  mode: 'keyboard' | 'mouse'
  active: boolean
  views: MagicMenuView[]
  viewInFocus: string
}
