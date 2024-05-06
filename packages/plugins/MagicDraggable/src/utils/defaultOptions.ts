import type { DraggableOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<DraggableOptions> & {
  threshold: RequireAll<DraggableOptions['threshold']>
  animation: RequireAll<DraggableOptions['animation']>
}

import { easeOutBack } from '@maas/vue-equipment/utils'

const defaultOptions: DefaultOptions = {
  tag: 'div',
  threshold: {
    distance: 128,
    momentum: 1.5,
    idle: 250,
    lock: 0,
  },
  animation: {
    snap: {
      duration: 500,
      easing: easeOutBack,
    },
  },
  initial: {
    snapPoint: 'center',
  },
  snapPoints: [],
  disabled: false,
}

export { defaultOptions, type DefaultOptions }
