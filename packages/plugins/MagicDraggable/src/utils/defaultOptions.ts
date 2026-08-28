import { easeOutBack } from '@maas/vue-equipment/utils'

import type { RequiredMagicDraggableOptions } from '../types'

const defaultOptions: RequiredMagicDraggableOptions = {
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
  preventEdgeNavigation: true,
  disabled: false,
}

export { defaultOptions }
