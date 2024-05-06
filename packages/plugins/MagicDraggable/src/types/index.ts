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

export type SnapPoint =
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
  }
  animation?: {
    snap?: {
      duration?: number
      easing?: (t: number) => number
    }
  }
  initial?: {
    snapPoint?: SnapPoint
  }
  snapPoints: SnapPoint[]
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
