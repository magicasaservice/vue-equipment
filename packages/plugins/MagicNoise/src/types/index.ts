import type { Pausable } from '@vueuse/core'

export type Pixel = {
  w: number
  h: number
  x: number
  y: number
  r?: number
}

export type RafControls = Pick<Pausable, 'pause' | 'resume'>

export type MagicNoiseOptions = {
  pixelSize?: number
  tiles?: number
  fps?: number
  color?: string
}
