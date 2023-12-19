import type { NoiseOptions } from '../types/index'
import type { RequireAll } from 'utils'

const defaultOptions: RequireAll<NoiseOptions> = {
  pixelSize: 2,
  tiles: 32,
  fps: 12,
  color: 'white',
}

export { defaultOptions }
