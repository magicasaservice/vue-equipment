import type { ToRefs } from 'vue'

export interface MagicMenuItem {
  id: string
  active: boolean
  disabled: boolean
}

export interface MagicMenuView {
  id: string
  active: boolean
  items: MagicMenuItem[]
  parent: { item: string; views: string[] }
}

export interface MagicMenuState {
  id: string
  active: boolean
  views: MagicMenuView[]
  input: 'keyboard' | 'mouse'
  inputView: string
}
