export type Dimensions = { width: number; height: number }
export type ScrollDirection = 'up' | 'down'
export type Position = 'top' | 'bottom'

export type FromTo =
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

export type ScrollEvents = {
  collision: {
    id: string
    direction: ScrollDirection
    position: Position
  }
}
