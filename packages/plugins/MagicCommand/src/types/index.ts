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

export type MagicCommandEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

export interface MagicCommandModalOptions extends MagicModalOptions {}
export interface MagicCommandDrawerOptions extends MagicDrawerOptions {}
