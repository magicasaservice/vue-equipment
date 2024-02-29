import { type Options } from 'focus-trap'

type Progress = {
  x: number
  y: number
}

export type SnapPoint = number | `${string}px`

export interface DrawerOptions {
  position?: 'top' | 'right' | 'bottom' | 'left'
  backdrop?: boolean
  focusTrap?: boolean | Options
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
    lock?: number
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
  beforeDrag: {
    id: string
    x: number
    y: number
  }
  drag: {
    id: string
    x: number
    y: number
  }
  afterDrag: {
    id: string
    x: number
    y: number
  }
  progress: {
    id: string
    x: number
    y: number
  }
}
