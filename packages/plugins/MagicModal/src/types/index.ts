import { type Options } from 'focus-trap'

export interface ModalOptions {
  backdrop?: boolean
  tag?: 'dialog' | 'div'
  focusTrap?: boolean | Options
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
