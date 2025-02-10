import type { DOMKeyframesDefinition, AnimationOptions } from 'motion'

export type ScrollDirection = 'up' | 'down'
export type CollisionEdge = 'top' | 'bottom'

export type ScrollIntersection =
  | 'top-top'
  | 'top-center'
  | 'top-bottom'
  | 'center-top'
  | 'center-center'
  | 'center-bottom'
  | 'bottom-top'
  | 'bottom-center'
  | 'bottom-bottom'

export interface CollisionOffset {
  top: number
  bottom: number
}

export interface ScrollEvents {
  collision: {
    id: string
    direction: ScrollDirection
    childEdge: CollisionEdge
    parentEdge: CollisionEdge
  }
}

export type MagicScrollSequence = [DOMKeyframesDefinition, AnimationOptions?][]
