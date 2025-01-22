import type { MagicModalOptions } from '../../../MagicModal'
import type { MagicDrawerOptions } from '../../../MagicDrawer'

export interface MagicCommandOptions {
  debug?: boolean
  transition?: {
    content?: string
  }
  keyListener?: {
    open?: string[] | false
    close?: string[] | false
    next?: string[] | false
    prev?: string[] | false
    enter?: string[] | false
  }
  loop?: boolean
}

export type Action = 'open' | 'close'

export type Interaction = 'click' | 'mouseenter'

export interface CommandItem {
  id: string
  active: boolean
  disabled: boolean
}

export interface CommandChannel {
  id: string
  active: boolean
}

export interface CommandView {
  id: string
  active: boolean
  initial: boolean
  items: CommandItem[]
  channels: CommandChannel[]
  parent: { item: string; views: string[] }
  state: {
    selectAbortController: AbortController
    unselectAbortController: AbortController
  }
}

export interface CommandState {
  id: string
  active: boolean
  views: CommandView[]
  renderer: HTMLElement | undefined
  options: MagicCommandOptions
  input: {
    type: 'keyboard' | 'pointer'
    view: string | undefined
  }
}

export type CommandEvents = {
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

export type { MagicModalOptions as MagicCommandModalOptions }
export type { MagicDrawerOptions as MagicCommandDrawerOptions }
