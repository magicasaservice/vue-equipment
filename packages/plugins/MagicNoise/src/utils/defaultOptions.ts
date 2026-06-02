import type { MagicNoiseOptions } from '../types/index'

const defaultOptions: Required<MagicNoiseOptions> = {
  pixelSize: 2,
  tiles: 32,
  fps: 12,
  color: 'white',
  alpha: false,
  colorSpace: 'srgb',
}

export { defaultOptions }
