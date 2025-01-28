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
