export type SourceType = 'native' | 'hls'

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
