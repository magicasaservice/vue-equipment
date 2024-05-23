type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
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

export interface DraggableOptions {
  tag?: 'dialog' | 'div'
  threshold?: {
    distance?: number
    momentum?: number
    idle?: number
    lock?: number
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
  snapPoints?: DraggableSnapPoint[]
  disabled?: boolean
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
