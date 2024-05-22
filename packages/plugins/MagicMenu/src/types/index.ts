type MagicMenuMode = 'dropdown' | 'menubar' | 'context'
export type MagicMenuTrigger = 'click' | 'hover' | 'right-click'

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
  mode: MagicMenuMode[]
  input: 'keyboard' | 'mouse'
  inputView: string
  options: MagicMenuOptions
}
