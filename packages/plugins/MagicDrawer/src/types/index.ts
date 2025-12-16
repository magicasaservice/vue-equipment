import { type Options as FocusTrapOptions } from 'focus-trap'
import type { RequireAll } from '@maas/vue-equipment/utils'

export type DrawerSnapPoint = number | `${number}px`

export interface MagicDrawerOptions {
  position?: 'top' | 'right' | 'bottom' | 'left'
  backdrop?: boolean
  tag?: 'dialog' | 'div'
  focusTrap?: boolean | FocusTrapOptions
  scrollLock?: boolean | { padding: boolean }
  snapPoints?: DrawerSnapPoint[]
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
    snapPoint?: DrawerSnapPoint
  }
  keyListener?: {
    close?: string[] | false
  }
  enableMousewheel?: boolean
  preventZoom?: boolean
  preventDragClose?: boolean
  disabled?: boolean
}

export type DrawerDefaultOptions = RequireAll<MagicDrawerOptions> & {
  scrollLock: RequireAll<MagicDrawerOptions['scrollLock']>
  threshold: RequireAll<MagicDrawerOptions['threshold']>
  animation: RequireAll<MagicDrawerOptions['animation']>
  keyListener: RequireAll<MagicDrawerOptions['keyListener']>
}

export interface DrawerState {
  id: string
  refCount: number
  active: boolean
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
    snapPoint: DrawerSnapPoint
  }
  snapTo: {
    id: string
    snapPoint: DrawerSnapPoint
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: DrawerSnapPoint
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
