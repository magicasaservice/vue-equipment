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
    videoControls?: string
    overlay?: string
    icons?: string
  }
  threshold?: {
    idle?: number
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
    overlay: string
    icons: string
  }
  threshold: {
    idle: number
  }
}

export type Buffered = [number, number][]

export type PlayerErrorType =
  | 'play-promise-rejected'
  | 'media-element-error'
  | 'hls-network-error'
  | 'hls-media-error'
  | 'hls-fatal-error'
  | 'native-init-error'
  | 'hls-init-error'
  | 'unsupported-source'

export interface PlayerError {
  type: PlayerErrorType
  message: string
  timestamp?: number
  originalError?: Error
}

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
  seekedTime: number | null
  seekedPercentage: number
  scrubbedPercentage: number
  thumbPercentage: number
  popoverOffsetX: number | null
  hasOverlay: boolean
  hasControls: boolean
  controlsBarRect: DOMRect | undefined
  controlsTrackRect: DOMRect | undefined
  controlsPopoverRect: DOMRect | undefined
  errors: PlayerError[]
}

export interface PlayerEvents {
  onDragStart: string
  onDragEnd: string
  onEnd: string
  onFullscreenEnter: string
  onFullscreenLeave: string
  onLoad: string
  onMute: string
  onUnmute: string
  onPause: string
  onPlay: string
  onRateChange: string
  onStall: string
  onStart: string
  onTouch: string
  onVolumeChange: string
  onWait: string
}
