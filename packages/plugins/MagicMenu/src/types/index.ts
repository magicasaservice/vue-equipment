import type { RequireAllNested } from '@maas/vue-equipment/utils'

type MenuMode = 'dropdown' | 'menubar' | 'context'

export interface MagicMenuOptions {
  mode?: MenuMode
  transition?: {
    initial?: string
    final?: string
    nested?: string
  }
}

export type MenuTrigger = 'click' | 'mouseenter' | 'mouseleave' | 'right-click'

export type Coordinates = {
  x: number
  y: number
}

export interface MenuItem {
  id: string
  active: boolean
  disabled: boolean
}

export interface MenuView {
  id: string
  active: boolean
  items: MenuItem[]
  parent: { item: string; views: string[] }
  children: {
    trigger?: HTMLElement
    content?: HTMLElement
  }
  click?: Coordinates
}

export interface MenuState {
  id: string
  active: boolean
  views: MenuView[]
  options: RequireAllNested<MagicMenuOptions>
  input: {
    type: 'keyboard' | 'pointer'
    disabled: ('keyboard' | 'pointer')[]
    view: string | undefined
  }
}

export type MenuEvents = {
  beforeEnter: {
    id: string
    view: string
  }
  enter: {
    id: string
    view: string
  }
  afterEnter: {
    id: string
    view: string
  }
  beforeLeave: {
    id: string
    view: string
  }
  leave: {
    id: string
    view: string
  }
  afterLeave: {
    id: string
    view: string
  }
}
