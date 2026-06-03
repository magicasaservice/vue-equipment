import { type Options as FocusTrapOptions } from 'focus-trap'

export interface MagicModalOptions {
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

export type RequiredMagicModalOptions = Required<MagicModalOptions> & {
  teleport: Required<MagicModalOptions['teleport']>
  transition: Required<MagicModalOptions['transition']>
  keyListener: Required<MagicModalOptions['keyListener']>
}

export interface ModalEvents {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

export interface ModalState {
  id: string
  refCount: number
  active: boolean
  options: RequiredMagicModalOptions
}
