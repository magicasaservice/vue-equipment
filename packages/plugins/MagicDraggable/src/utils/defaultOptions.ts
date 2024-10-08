import type { MagicDraggableOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<MagicDraggableOptions> & {
  threshold: RequireAll<MagicDraggableOptions['threshold']>
  animation: RequireAll<MagicDraggableOptions['animation']>
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
  scrollLock: { padding: true },
}

export { defaultOptions, type DefaultOptions }
