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

export type Offset =
  | number
  | (({ vw, vh }: { vw: number; vh: number }) => number)

export interface MagicScrollCollisionEntry {
  offset?: {
    top: Offset
    bottom: Offset
  }
  element?: string
  data: Record<string, unknown>
}

export type ScrollEvents = {
  collision: {
    direction: ScrollDirection
    position: Position
    element: HTMLElement
    data?: Record<string, unknown>
  }
}
