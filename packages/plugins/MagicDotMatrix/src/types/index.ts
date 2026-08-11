export type DotMatrixFrame = Array<number>
export type DotMatrixSequence = Array<DotMatrixFrame>

export interface DotMatrixGrid {
  cols: number
  rows: number
}

export interface MagicDotMatrixOptions {
  cols?: number
  rows?: number
  interval?: number
  loop?: boolean | number
  autoplay?: boolean
}

export interface DotMatrixState {
  id: string
  refCount: number
  options: MagicDotMatrixOptions
  playing: boolean
  frame: number
  loops: number
}

export interface DotMatrixEvents {
  frameChange: {
    id: string
    frame: number
  }
  finish: {
    id: string
  }
}
