import type { MagicDraggableOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<MagicDraggableOptions> & {
  threshold: RequireAll<MagicDraggableOptions['threshold']>
  animation: RequireAll<MagicDraggableOptions['animation']>
}

import { easeOutBack } from '@maas/vue-equipment/utils'

const defaultOptions: DefaultOptions = {
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
    snapPoint: 'center',
  },
  disabled: false,
}

export { defaultOptions, type DefaultOptions }
