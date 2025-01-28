export interface MagicPlayerOptions {
  srcType?: 'native' | 'hls'
  preload?: 'auto' | 'metadata' | 'none'
  autoplay?: boolean
  loop?: boolean
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
