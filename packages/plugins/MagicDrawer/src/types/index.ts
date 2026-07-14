import { type Options as FocusTrapOptions } from 'focus-trap'
import type { RequireAllNested } from '@maas/vue-equipment/utils'

export type MagicDrawerSnapPoint = number | `${number}px`

export type DrawerSnapMode = 'closest' | 'step'

export interface MagicDrawerOptions {
  position?: 'top' | 'right' | 'bottom' | 'left'
  tag?: 'dialog' | 'div'
  focusTrap?: boolean | FocusTrapOptions
  scrollLock?: boolean | { padding: boolean }
  snapPoints?: MagicDrawerSnapPoint[]
  snap?: {
    mode?: DrawerSnapMode
  }
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
    snapPoint?: MagicDrawerSnapPoint
  }
  keyListener?: {
    close?: string[] | false
  }
  enableMousewheel?: boolean
  preventZoom?: boolean
  preventDragClose?: boolean
  disabled?: boolean
}

export type RequiredMagicDrawerOptions = Required<MagicDrawerOptions> & {
  snap: Required<MagicDrawerOptions['snap']>
  scrollLock: Required<MagicDrawerOptions['scrollLock']>
  threshold: Required<MagicDrawerOptions['threshold']>
  animation: RequireAllNested<NonNullable<MagicDrawerOptions['animation']>>
  keyListener: Required<MagicDrawerOptions['keyListener']>
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
  options: RequiredMagicDrawerOptions
}

export interface MagicDrawerWillSnapToPayload {
  id: string
  snapPoint: MagicDrawerSnapPoint
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
    snapPoint: MagicDrawerSnapPoint
  }
  snapTo: {
    id: string
    snapPoint: MagicDrawerSnapPoint
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: MagicDrawerSnapPoint
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
  willSnapTo: MagicDrawerWillSnapToPayload
}

export interface DrawerActive {
  innerActive: boolean
  wrapperActive: boolean
}
