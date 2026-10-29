export type DotMatrixFrame = Array<number>
export type DotMatrixLayeredFrame = Array<DotMatrixFrame>
export type DotMatrixSequence = Array<DotMatrixFrame | DotMatrixLayeredFrame>

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
  finish: {
    id: string
  }
}

export type DotMatrixEmojiMotion =
  | 'beat'
  | 'flicker'
  | 'swing'
  | 'wave'
  | 'fly'
  | 'drive'
  | 'bounce'
  | 'hop'
  | 'spin'
  | 'flip'
  | 'float'
  | 'twinkle'
  | 'shake'
  | 'rain'
  | 'snow'
  | 'sleep'
  | 'rock'
  | 'burst'
  | 'stamp'
  | 'gleam'
  | 'flag'
  | 'sway'
  | 'love'
  | 'steam'
  | 'look'
  | 'nod'
  | 'tilt'
  | 'swim'
  | 'flap'
  | 'clap'
  | 'bob'
  | 'pop'

export interface MagicDotMatrixEmojiOptions {
  cols?: number
  rows?: number
  colors?: number
  threshold?: number
}

export interface DotMatrixEmojiAnimation {
  motion: DotMatrixEmojiMotion
  interval: number
  sequence: Array<DotMatrixLayeredFrame>
  colors: Array<string>
}
