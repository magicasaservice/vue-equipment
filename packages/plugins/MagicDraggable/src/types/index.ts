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
  teleport?: {
    target?: string
    disabled?: boolean
  }
  threshold?: {
    distance?: number
    momentum?: number
  }
  snap?: {
    points: SnapPoint[]
    duration?: number
    initial?: SnapPoint
  }
  tag?: 'dialog' | 'div'
  disabled?: boolean
}

export interface DraggableState {
  id: string
  dragStart: Date | undefined
  dragging: boolean
  interpolateTo: { x: number; y: number } | undefined
  originX: number
  originY: number
  lastDraggedX: number
  lastDraggedY: number
  draggedX: number
  draggedY: number
  elRect: DOMRect | undefined
  wrapperRect: DOMRect | undefined
}
