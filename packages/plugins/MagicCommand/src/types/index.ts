import type { ComputedRef } from 'vue'
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
  initial: boolean
  parent: {
    views: string[]
  }
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
  teleportTarget: HTMLElement | undefined
  input: {
    type: 'pointer' | 'keyboard'
    view: ComputedRef<string | undefined>
  }
}

export interface MagicCommandModalOptions extends MagicModalOptions {}
export interface MagicCommandDrawerOptions extends MagicDrawerOptions {}
