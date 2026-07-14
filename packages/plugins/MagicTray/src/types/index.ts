import type { RequireAllNested } from '@maas/vue-equipment/utils'
import type { EasingKey } from '@maas/vue-equipment/composables/useEasings'

export type MagicTraySide = 'top' | 'right' | 'bottom' | 'left'

export type MagicTraySnapPoint = number | `${number}px`

export interface MagicTraySnapPointPayload {
  side: MagicTraySide
  point: MagicTraySnapPoint
}

// Shared payload for the per-side value events (drag, progress, magnet)
export interface MagicTraySidePayload {
  side: MagicTraySide
  value: number
}

export type MagicTraySnapMode = 'closest' | 'step'

export type MagicTrayDragMode = 'free' | 'snap'

export type TraySnapPoints = Partial<Record<MagicTraySide, MagicTraySnapPoint[]>>

// Which approach arms a snap point
export type TrayMagneticDirection = 'inner' | 'outer' | 'both'

// A per side mapping of individual snap points and their direction
export type TrayMagneticSide = Partial<
  Record<MagicTraySnapPoint, TrayMagneticDirection>
>

export type TrayMagneticSides =
  | false
  | Partial<Record<MagicTraySide, TrayMagneticSide>>

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

export type TraySideRecord<T> = Record<MagicTraySide, T>

export type MagicTrayTransformAxis = 'both' | 'x' | 'y'

export interface MagicTrayOptions {
  tag?: 'div' | 'dialog' | 'main' | 'section' | 'article' | 'aside' | 'nav'
  snapPoints?: TraySnapPoints
  snap?: {
    mode?: MagicTraySnapMode
  }
  drag?: {
    // 'free' follows the pointer and settles on release; 'snap' commits
    // straight to the nearest snap point while dragging, no free follow
    mode?: MagicTrayDragMode | Partial<Record<MagicTraySide, MagicTrayDragMode>>
  }
  handles?: boolean | Partial<Record<MagicTraySide, boolean>>
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
    snapPoints?: Partial<Record<MagicTraySide, MagicTraySnapPoint>>
    transition?: boolean
  }
  disabled?: boolean
  inset?: boolean
}

export type RequiredMagicTrayOptions = Required<MagicTrayOptions> & {
  snap: Required<MagicTrayOptions['snap']>
  drag: Required<MagicTrayOptions['drag']>
  magnetism: Required<TrayMagnetism>
  threshold: Required<MagicTrayOptions['threshold']>
  animation: RequireAllNested<NonNullable<MagicTrayOptions['animation']>>
}

export interface TrayState {
  id: string
  refCount: number
  dragStart: Date | undefined
  dragging: boolean
  draggingSide: MagicTraySide | undefined
  interpolateTo: number | undefined
  origin: number
  dragged: TraySideRecord<number>
  magnetic: TraySideRecord<number>
  snapped: TraySideRecord<number>
  lastDragged: TraySideRecord<number>
  relDirection: TraySideRecord<'below' | 'above' | 'absolute'>
  activeSnapPoint: Partial<Record<MagicTraySide, MagicTraySnapPoint>>
  progress: TraySideRecord<number>
  overshoot: {
    outer: TraySideRecord<number>
    inner: number
  }
  elRect: DOMRect | undefined
  options: RequiredMagicTrayOptions
}

export interface MagicTrayWillSnapToPayload {
  id: string
  side: MagicTraySide
  snapPoint: MagicTraySnapPoint
}

export type TrayEvents = {
  beforeSnap: {
    id: string
    snapPoint: MagicTraySnapPointPayload
  }
  snapTo: {
    id: string
    snapPoint: MagicTraySnapPointPayload
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: MagicTraySnapPointPayload
  }
  beforeDrag: { id: string } & MagicTraySidePayload
  drag: { id: string } & MagicTraySidePayload
  afterDrag: { id: string } & MagicTraySidePayload
  progress: { id: string } & MagicTraySidePayload
  magnet: { id: string } & MagicTraySidePayload
  willSnapTo: MagicTrayWillSnapToPayload
}
