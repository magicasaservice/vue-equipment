import type { Placement } from '@floating-ui/vue'

type MenuMode = 'dropdown' | 'menubar' | 'context' | 'navigation'

export interface MagicMenuOptions {
  mode?: MenuMode
  debug?: boolean
  scrollLock?: boolean | { padding: boolean }
  transition?: {
    content?: {
      default?: string
      nested?: string
    }
    channel?: string
  }
  floating?: {
    strategy: 'fixed' | 'absolute'
  }
  delay?: {
    mouseenter?: number
    mouseleave?: number
    click?: number
    rightClick?: number
  }
}

export interface RequiredMagicMenuOptions {
  mode: MenuMode
  debug: boolean
  transition: {
    content: {
      default: string
      nested: string
    }
    channel: string
  }
}

export type OptionalMagicMenuOptions = Pick<
  MagicMenuOptions,
  'scrollLock' | 'floating' | 'delay'
>

export type CombinedMagicMenuOptions = RequiredMagicMenuOptions &
  OptionalMagicMenuOptions

export type Interaction = 'click' | 'mouseenter' | 'right-click'

export type Coordinates = {
  x: number
  y: number
}

export interface MenuItem {
  id: string
  active: boolean
  disabled: boolean
}

export interface MenuChannel {
  id: string
  active: boolean
}

export interface MenuView {
  id: string
  active: boolean
  items: MenuItem[]
  channels: MenuChannel[]
  parent: { item: string; views: string[] }
  placement: Placement
  state: {
    selectAbortController: AbortController
    unselectAbortController: AbortController
    clicked?: Coordinates
  }
}

export interface MenuState {
  id: string
  active: boolean
  views: MenuView[]
  options: CombinedMagicMenuOptions
  input: {
    type: 'keyboard' | 'pointer'
    disabled: ('keyboard' | 'pointer')[]
    view: string | undefined
  }
}

export type MenuEvents = {
  beforeEnter: {
    id: string
    viewId: string
  }
  enter: {
    id: string
    viewId: string
  }
  afterEnter: {
    id: string
    viewId: string
  }
  beforeLeave: {
    id: string
    viewId: string
  }
  leave: {
    id: string
    viewId: string
  }
  afterLeave: {
    id: string
    viewId: string
  }
}
