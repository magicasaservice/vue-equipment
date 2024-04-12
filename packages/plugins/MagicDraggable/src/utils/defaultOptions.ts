import type { DraggableOptions } from '../types'
import type { RequireAll } from '@maas/vue-equipment/utils'

type DefaultOptions = RequireAll<DraggableOptions>

const defaultOptions: DefaultOptions = {
  teleport: {
    target: 'body',
    disabled: false,
  },
  threshold: {
    distance: 128,
    momentum: 1,
  },
  snap: {
    points: ['center'],
    duration: 200,
    initial: 'center',
  },
  tag: 'div',
  disabled: false,
}

export { defaultOptions, type DefaultOptions }
