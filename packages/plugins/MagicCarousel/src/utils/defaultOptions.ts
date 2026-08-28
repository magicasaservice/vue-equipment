import { easeOutQuad } from '@maas/vue-equipment/utils'
import type { RequiredMagicCarouselOptions } from '../types'

const defaultOptions: RequiredMagicCarouselOptions = {
  loop: false,
  threshold: {
    lock: 10,
  },
  animation: {
    snap: {
      duration: 300,
      easing: easeOutQuad,
    },
    momentum: {
      friction: 0.72,
      damping: 0.12,
    },
  },
  disabled: false,
}

export { defaultOptions }
