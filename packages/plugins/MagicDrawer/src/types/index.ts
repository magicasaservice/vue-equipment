import { type Options } from 'focus-trap'

export type SnapPoint = number | `${string}px`

export interface DrawerOptions {
  position?: 'top' | 'right' | 'bottom' | 'left'
  backdrop?: boolean
  tag?: 'dialog' | 'div'
  focusTrap?: boolean | Options
  scrollLock?: boolean | { padding: boolean }
  snapPoints?: SnapPoint[]
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transition?: {
    content?: string
    backdrop?: string
  }
  threshold?: {
    lock?: number
    distance?: number
    momentum?: number
  }
  animation?: {
    snap?: {
      duration?: number
      easing?: (t: number) => number
    }
  }
  initial?: {
    open?: boolean
    transition?: boolean
    snapPoint?: SnapPoint
  }
  keyListener?: {
    close?: string[] | false
  }
  enableMousewheel?: boolean
  preventZoom?: boolean
  preventDragClose?: boolean
  disabled?: boolean
}

export interface DrawerState {
  id: string
  dragStart: Date | undefined
  dragging: boolean
  wheeling: boolean
  progress: {
    x: number
    y: number
  }
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
