import { type Options as FocusTrapOptions } from 'focus-trap'

export interface MagicModalOptions {
  backdrop?: boolean
  tag?: 'dialog' | 'div'
  focusTrap?: boolean | FocusTrapOptions
  scrollLock?: boolean | { padding: boolean }
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transition?: {
    content?: string
    backdrop?: string
  }
  keyListener?: {
    close?: string[] | false
  }
}

export type ModalEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}
