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
  buffered: Buffered
  currentTime: number
  dragging: boolean
  duration: number
  ended: boolean
  loaded: boolean
  muted: boolean
  paused: boolean
  playing: boolean
  rate: number
  seeking: boolean
  stalled: boolean
  started: boolean
  touched: boolean
  volume: number
  waiting: boolean
  fullscreen: boolean
  fullscreenTarget: HTMLElement | null
  mouseEntered: boolean
  controlsMouseEntered: boolean
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

export interface PlayerEvents {
  buffered: { id: string; value: Buffered }
  currentTime: { id: string; value: number }
  dragging: { id: string; value: boolean }
  duration: { id: string; value: number }
  ended: { id: string; value: boolean }
  fullscreen: { id: string; value: boolean }
  loaded: { id: string; value: boolean }
  muted: { id: string; value: boolean }
  paused: { id: string; value: boolean }
  playing: { id: string; value: boolean }
  rate: { id: string; value: number }
  seeking: { id: string; value: boolean }
  stalled: { id: string; value: boolean }
  started: { id: string; value: boolean }
  touched: { id: string; value: boolean }
  volume: { id: string; value: number }
  waiting: { id: string; value: boolean }
}
