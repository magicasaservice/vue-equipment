import { easeOutQuad } from '@maas/vue-equipment/utils'
import type { RequiredMagicTrayOptions } from '../types'

const defaultOptions: RequiredMagicTrayOptions = {
  tag: 'div',
  snapPoints: {
    bottom: [0, 0.5, 1],
  },
  snap: {
    mode: 'closest',
  },
  handles: true,
  threshold: {
    lock: 0,
    distance: 128,
    momentum: 1,
  },
  animation: {
    snap: {
      duration: 300,
      easing: easeOutQuad,
    },
  },
  initial: {},
  disabled: false,
  inset: false,
}

export { defaultOptions }
