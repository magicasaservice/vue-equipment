import { type Options } from 'focus-trap'

export interface ModalOptions {
  backdrop?: boolean
  focusTrap?: boolean | Options
  scrollLock?: boolean
  scrollLockPadding?: boolean
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transitions?: {
    content?: string
    backdrop?: string
  }
  tag?: 'dialog' | 'div'
  keys?: string[] | false
}

export type ModalEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}
