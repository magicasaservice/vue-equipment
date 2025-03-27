import type { DraggableDefaultOptions } from '../types'

import { easeOutBack } from '@maas/vue-equipment/utils'

const defaultOptions: DraggableDefaultOptions = {
  tag: 'div',
  scrollLock: { padding: true },
  snapPoints: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  threshold: {
    lock: 0,
    distance: 128,
    momentum: 1.5,
    idle: 250,
  },
  animation: {
    snap: {
      duration: 500,
      easing: easeOutBack,
    },
  },
  initial: {
    snapPoint: 'top-left',
  },
  disabled: false,
}

export { defaultOptions }
