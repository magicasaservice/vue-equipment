import type { MagicModalOptions } from '../../../MagicModal'
import type { MagicDrawerOptions } from '../../../MagicDrawer'

export type MagicCommandOptions = {
  keys?: {
    open?: string[] | false
    close?: string[] | false
    next?: string[] | false
    prev?: string[] | false
  }
  loop?: boolean
}

export type CommandTrigger = 'click' | 'mouseenter'

export interface CommandItem {
  id: string
  active: boolean
  disabled: boolean
}

export type CommandView = {
  id: string
  active: boolean
  children: {
    trigger?: HTMLElement
    content?: HTMLElement
  }
  items: CommandItem[]
}

export type CommandState = {
  id: string
  options: MagicCommandOptions
  views: CommandView[]
  active: boolean
}

export interface MagicCommandModalOptions extends MagicModalOptions {}
export interface MagicCommandDrawerOptions extends MagicDrawerOptions {}
