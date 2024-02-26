import type { ModalOptions } from '../../../MagicModal'
import type { DrawerOptions } from '../../../MagicDrawer'

export type CommandOptions = {
  keys?: {
    open?: string[] | false
    close?: string[] | false
    next?: string[] | false
    prev?: string[] | false
  }
  loop?: boolean
}

export type CommandEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

export interface CommandModalOptions extends ModalOptions {}
export interface CommandDrawerOptions extends DrawerOptions {}
