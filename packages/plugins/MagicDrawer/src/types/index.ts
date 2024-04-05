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
  canScroll?: boolean
  canClose?: boolean
  disabled?: boolean
}

export interface DrawerState {
  id: string
  dragStart: Date | undefined
  dragging: boolean
  wheeling: boolean
  shouldClose: boolean
  interpolateTo: number | undefined
  originX: number
  originY: number
  lastDraggedX: number
  lastDraggedY: number
  draggedX: number
  draggedY: number
  relDirectionY: 'below' | 'above' | 'absolute' // Used to determine closest snap point
  relDirectionX: 'below' | 'above' | 'absolute'
  absDirectionY: 'with' | 'against' | undefined // Used to determine scroll lock
  absDirectionX: 'with' | 'against' | undefined
  elRect: DOMRect | undefined
  wrapperRect: DOMRect | undefined
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
    duration?: number
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
