import type { Ref } from 'vue'

type AlertPositions = {
  top: boolean
  bottom: boolean
}

type CollisionEvents = {
  'magic-scroll:collision': {
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

type WindowDimensions = { vw: Ref<number>; vh: Ref<number> }

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

export * from './injection-symbols/magic-scroll'
export type {
  FromTo,
  CollisionEvents,
  CollisionEntry,
  CollisionMappedEntry,
  WindowDimensions,
}
