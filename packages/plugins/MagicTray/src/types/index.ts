import type { RequireAllNested } from '@maas/vue-equipment/utils'
import type { EasingKey } from '@maas/vue-equipment/composables/useEasings'

export type TraySide = 'top' | 'right' | 'bottom' | 'left'

export type TraySnapPoint = number | `${number}px`

export interface TraySnapPointPayload {
  side: TraySide
  point: TraySnapPoint
}

// Shared payload for the per-side value events (drag, progress, magnet)
export interface TraySidePayload {
  side: TraySide
  value: number
}

export type TraySnapMode = 'closest' | 'step'

export type TraySnapPoints = Partial<Record<TraySide, TraySnapPoint[]>>

// Which approach arms a snap point
export type TrayMagneticDirection = 'inner' | 'outer' | 'both'

// A per side mapping of individual snap points and their direction
export type TrayMagneticSide = Partial<
  Record<TraySnapPoint, TrayMagneticDirection>
>

export type TrayMagneticSides =
  | false
  | Partial<Record<TraySide, TrayMagneticSide>>

// The scrub band, as perpendicular distances from the resting edge on the
// approach side: `start` is where the pull engages, `stop` where it tops out and
// latches (defaults to `pull`, so the previewed edge meets the cursor there). A
// bare number is the deprecated form, ramping straight to the edge.
export type TrayMagneticRadius = number | { start?: number; stop?: number }

export interface TrayMagnetism {
  sides?: TrayMagneticSides
  radius?: TrayMagneticRadius
  pull?: number
  easing?: EasingKey
  virtual?: boolean
}

export type TraySideRecord<T> = Record<TraySide, T>

export type TrayTransformAxis = 'both' | 'x' | 'y'

export interface MagicTrayOptions {
  tag?: 'div' | 'dialog' | 'main' | 'section' | 'article' | 'aside' | 'nav'
  snapPoints?: TraySnapPoints
  snap?: {
    mode?: TraySnapMode
  }
  handles?: boolean | Partial<Record<TraySide, boolean>>
  magnetism?: TrayMagnetism
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
  snap: Required<MagicTrayOptions['snap']>
  magnetism: Required<TrayMagnetism>
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
  magnetic: TraySideRecord<number>
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

export interface TrayWillSnapToPayload {
  id: string
  side: TraySide
  snapPoint: TraySnapPoint
}

export type TrayEvents = {
  beforeSnap: {
    id: string
    snapPoint: TraySnapPointPayload
  }
  snapTo: {
    id: string
    snapPoint: TraySnapPointPayload
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: TraySnapPointPayload
  }
  beforeDrag: { id: string } & TraySidePayload
  drag: { id: string } & TraySidePayload
  afterDrag: { id: string } & TraySidePayload
  progress: { id: string } & TraySidePayload
  magnet: { id: string } & TraySidePayload
  willSnapTo: TrayWillSnapToPayload
}
