export interface MagicPlayerOptions {
  src: string
  mode?: 'audio' | 'video'
  srcType?: 'native' | 'hls'
  preload?: 'auto' | 'metadata' | 'none'
  autoplay?: boolean
  loop?: boolean
  transition?: {
    videoControls: string
  }
}

type API = 'media' | 'player' | 'controls' | 'runtime' | 'player'

export type Buffered = [number, number][]

export type PlayerPrivateEvents = {
  update: {
    id: string
    api: API
    key: string
    value: string | number | boolean | Buffered | DOMRect | HTMLElement
  }
}

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
