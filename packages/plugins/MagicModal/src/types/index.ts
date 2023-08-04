type DefaultOptions = {
  backdrop?: boolean
  focusTrap?: boolean
  scrollLock?: boolean
  scrollLockPadding?: boolean
  teleport?: {
    target: string
    disabled?: boolean
  }
  transitions?: {
    content?: string
    backdrop?: string
  }
}

type ModalEvents = {
  afterEnter: string
  afterLeave: string
  beforeEnter: string
  beforeLeave: string
}

export type { DefaultOptions, ModalEvents }
