export interface MagicMarqueeOptions {
  direction?: 'reverse' | 'normal'
  speed?: number
}

export interface MarqueeState {
  id: string
  refCount: number
  options: MagicMarqueeOptions
  playing: boolean
}
