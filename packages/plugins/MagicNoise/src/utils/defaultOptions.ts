import type { MagicNoiseOptions } from '../types/index'
import type { RequireAll } from '@maas/vue-equipment/utils'

const defaultOptions: RequireAll<MagicNoiseOptions> = {
  pixelSize: 2,
  tiles: 32,
  fps: 12,
  color: 'white',
}

export { defaultOptions }
