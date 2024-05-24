type MagicMenuMode = 'dropdown' | 'menubar' | 'context'

export type MagicMenuTrigger =
  | 'click'
  | 'mouseenter'
  | 'mouseleave'
  | 'right-click'

export type Coordinates = {
  x: number
  y: number
}

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

export interface MagicMenuOptions {
  mode: MagicMenuMode
}

export interface MagicMenuState {
  id: string
  active: boolean
  views: MagicMenuView[]
  options: MagicMenuOptions
  input: {
    type: 'keyboard' | 'pointer'
    disabled: ('keyboard' | 'pointer')[]
    view: string
  }
}
