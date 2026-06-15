export type TraySide = 'top' | 'right' | 'bottom' | 'left'

export type TraySnapPoint = number | `${number}px`

export type TraySnapPoints = Partial<Record<TraySide, TraySnapPoint[]>>

export type TraySideRecord<T> = Record<TraySide, T>

// Which axes MagicTrayTransform is allowed to translate along.
export type TrayTransformAxis = 'both' | 'x' | 'y'

export interface MagicTrayOptions {
  tag?: 'div' | 'dialog' | 'main' | 'section' | 'article' | 'aside' | 'nav'
  // Snap points are defined per side.
  // A side that has at least one snap point is draggable.
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
  }
  disabled?: boolean
}

export type RequiredMagicTrayOptions = Required<MagicTrayOptions> & {
  threshold: Required<MagicTrayOptions['threshold']>
  animation: Required<MagicTrayOptions['animation']>
}

export interface TrayState {
  id: string
  refCount: number
  dragStart: Date | undefined
  dragging: boolean
  draggingSide: TraySide | undefined
  interpolateTo: number | undefined
  origin: number
  // Per side current inset in pixels
  dragged: TraySideRecord<number>
  // Per side last snapped inset in pixels
  snapped: TraySideRecord<number>
  // Per side inset at the start of the current drag
  lastDragged: TraySideRecord<number>
  // Direction of the current drag, used to find the closest snap point
  relDirection: TraySideRecord<'below' | 'above' | 'absolute'>
  // Per side active snap point (input value), used for resize and resnapping
  activeSnapPoint: Partial<Record<TraySide, TraySnapPoint>>
  // Per side inset progress (0 = open, 1 = fully clipped)
  progress: TraySideRecord<number>
  // Per side reserved overshoot padding in pixels (measured from the element).
  // This is the empty room each draggable edge can bounce into.
  padding: TraySideRecord<number>
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
