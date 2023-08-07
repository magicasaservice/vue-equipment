import type { Ref } from 'vue'

type AlertPositions = {
  top: boolean
  bottom: boolean
}

type CollisionEvents = {
  collision: {
    dir: 'up' | 'down'
    pos: 'top' | 'bottom'
    el: HTMLElement
    data?: Record<string, any>
  }
}

interface CollisionEntry {
  offset?: {
    top: number | (() => number)
    bottom: number | (() => number)
  }
  element?: string
  data: Record<string, any>
}

interface CollisionMappedEntry extends Omit<CollisionEntry, 'element'> {
  alerted: {
    up: AlertPositions
    down: AlertPositions
  }
  element: HTMLElement
}

type Dimensions = { width: number; height: number }

type FromTo =
  | 'top-top'
  | 'top-center'
  | 'top-bottom'
  | 'center-top'
  | 'center-center'
  | 'center-bottom'
  | 'bottom-top'
  | 'bottom-center'
  | 'bottom-bottom'

export * from './injectionKeys'

export type {
  FromTo,
  CollisionEvents,
  CollisionEntry,
  CollisionMappedEntry,
  Dimensions,
}
