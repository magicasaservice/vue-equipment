import type { RequireAllNested } from '@maas/vue-equipment/utils'

export type TraySide = 'top' | 'right' | 'bottom' | 'left'

export type TraySnapPoint = number | `${number}px`

export type TraySnapPoints = Partial<Record<TraySide, TraySnapPoint[]>>

export type TraySideRecord<T> = Record<TraySide, T>

export type TrayTransformAxis = 'both' | 'x' | 'y'

export interface MagicTrayOptions {
  tag?: 'div' | 'dialog' | 'main' | 'section' | 'article' | 'aside' | 'nav'
  snapPoints?: TraySnapPoints
  handles?: boolean | Partial<Record<TraySide, boolean>>
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
    snapPoints?: Partial<Record<TraySide, TraySnapPoint>>
    transition?: boolean
  }
  disabled?: boolean
  inset?: boolean
}

export type RequiredMagicTrayOptions = Required<MagicTrayOptions> & {
  threshold: Required<MagicTrayOptions['threshold']>
  animation: RequireAllNested<NonNullable<MagicTrayOptions['animation']>>
}

export interface TrayState {
  id: string
  refCount: number
  dragStart: Date | undefined
  dragging: boolean
  draggingSide: TraySide | undefined
  interpolateTo: number | undefined
  origin: number
  dragged: TraySideRecord<number>
  snapped: TraySideRecord<number>
  lastDragged: TraySideRecord<number>
  relDirection: TraySideRecord<'below' | 'above' | 'absolute'>
  activeSnapPoint: Partial<Record<TraySide, TraySnapPoint>>
  progress: TraySideRecord<number>
  overshoot: {
    outer: TraySideRecord<number>
    inner: number
  }
  elRect: DOMRect | undefined
  options: RequiredMagicTrayOptions
}

export type TrayEvents = {
  beforeSnap: {
    id: string
    side: TraySide
    snapPoint: TraySnapPoint
  }
  snapTo: {
    id: string
    side: TraySide
    snapPoint: TraySnapPoint
    duration?: number
  }
  afterSnap: {
    id: string
    side: TraySide
    snapPoint: TraySnapPoint
  }
  beforeDrag: {
    id: string
    side: TraySide
    value: number
  }
  drag: {
    id: string
    side: TraySide
    value: number
  }
  afterDrag: {
    id: string
    side: TraySide
    value: number
  }
  progress: {
    id: string
    side: TraySide
    value: number
  }
}
