export interface MagicMenuItem {
  id: string
  parent: string[]
  active: boolean
}

export interface MagicMenuView {
  id: string
  parent: string[]
  active: boolean
}

export interface MagicMenuState {
  id: string
  items: MagicMenuItem[]
  views: MagicMenuView[]
  active: boolean
  mode: 'keyboard' | 'mouse'
}
