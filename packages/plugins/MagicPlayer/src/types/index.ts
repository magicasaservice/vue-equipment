type PlayerMode = 'audio' | 'video'

export interface MagicPlayerOptions {
  src: string
  mode?: PlayerMode
  srcType?: 'native' | 'hls'
  preload?: 'auto' | 'metadata' | 'none'
  autoplay?: boolean
  playback?: ('viewport' | 'window')[] | false
  loop?: boolean
  transition?: {
    videoControls: string
  }
}

export interface RequiredMagicPlayerOptions {
  src: string
  mode: 'audio' | 'video'
  srcType: 'native' | 'hls'
  preload: 'auto' | 'metadata' | 'none'
  autoplay: boolean
  loop: boolean
  transition: {
    videoControls: string
  }
}

export type Buffered = [number, number][]

export interface PlayerState {
  id: string
  currentTime: number
  duration: number
  seeking: boolean
  volume: number
  rate: number
  loaded: boolean
  waiting: boolean
  ended: boolean
  playing: boolean
  started: boolean
  paused: boolean
  stalled: boolean
  buffered: Buffered
  muted: boolean
  touched: boolean
  isFullscreen: boolean
  fullscreenTarget: HTMLElement | null
  mouseEntered: boolean
  controlsMouseEntered: boolean
  dragging: boolean
  seekedTime: number
  seekedPercentage: number
  scrubbedPercentage: number
  thumbPercentage: number
  popoverOffsetX: number
  hasOverlay: boolean
  hasControls: boolean
  controlsBarRect: DOMRect | undefined
  controlsTrackRect: DOMRect | undefined
  controlsPopoverRect: DOMRect | undefined
}
