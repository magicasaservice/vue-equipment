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

export type { DefaultOptions }
