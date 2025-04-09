import type { RequireAll } from '@maas/vue-equipment/utils'

type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

export type Coordinates = {
  x: number
  y: number
}

export type DraggableSnapPoint =
  | [
      Position,
      offset?: {
        x?: number
        y?: number
      }
    ]
  | Position

export interface MagicDraggableOptions {
  tag?: 'dialog' | 'div'
  scrollLock?: boolean | { padding: boolean }
  snapPoints?: DraggableSnapPoint[]
  threshold?: {
    lock?: number
    distance?: number
    momentum?: number
    idle?: number
  }
  animation?: {
    snap?: {
      duration?: number
      easing?: (t: number) => number
    }
  }
  initial?: {
    snapPoint?: DraggableSnapPoint
  }
  disabled?: boolean
}

export type DraggableDefaultOptions = RequireAll<MagicDraggableOptions> & {
  threshold: RequireAll<MagicDraggableOptions['threshold']>
  animation: RequireAll<MagicDraggableOptions['animation']>
}

export interface DraggableState {
  id: string
  dragStart: Date | undefined
  dragging: boolean
  interpolateTo: Coordinates | undefined
  originX: number
  originY: number
  lastDraggedX: number
  lastDraggedY: number
  intermediateDraggedX: number
  intermediateDraggedY: number
  draggedX: number
  draggedY: number
  elRect: DOMRect | undefined
  wrapperRect: DOMRect | undefined
  activeSnapPoint: DraggableSnapPoint | undefined
}

export type DraggableEvents = {
  beforeSnap: {
    id: string
    snapPoint: DraggableSnapPoint
  }
  snapTo: {
    id: string
    snapPoint: DraggableSnapPoint
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: DraggableSnapPoint
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
  dragCanceled: {
    id: string
    x: number
    y: number
  }
}
