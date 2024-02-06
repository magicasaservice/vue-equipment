export type SnapPoint = number | `${string}px`

export type DrawerOptions = {
  position?: 'top' | 'right' | 'bottom' | 'left'
  backdrop?: boolean
  focusTrap?: boolean
  scrollLock?: boolean
  scrollLockPadding?: boolean
  preventZoom?: boolean
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transitions?: {
    content?: string
    backdrop?: string
  }
  threshold?: {
    distance?: number
    momentum?: number
  }
  tag?: 'dialog' | 'div'
  keys?: string[] | false
  beforeMount?: {
    open: boolean
    animate: boolean
  }
  snap?: {
    points: SnapPoint[]
    duration?: number
    initial?: SnapPoint
  }
  canClose?: boolean
}

export type DrawerEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
  beforeSnap: {
    id: string
    snapPoint: SnapPoint
  }
  snapTo: {
    id: string
    snapPoint: SnapPoint
  }
  afterSnap: {
    id: string
    snapPoint: SnapPoint
  }
}

export interface CustomMouseEvent extends MouseEvent {
  custom?: string
}
