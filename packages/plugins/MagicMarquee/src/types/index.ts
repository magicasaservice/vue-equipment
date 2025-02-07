export interface MagicMarqueeOptions {
  direction?: 'reverse' | 'normal'
  speed?: number
}

export interface MarqueeState {
  id: string
  options: MagicMarqueeOptions
  playing: boolean
}
