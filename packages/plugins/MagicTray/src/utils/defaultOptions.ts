import type { RequiredMagicTrayOptions } from '../types'

const defaultOptions: RequiredMagicTrayOptions = {
  tag: 'div',
  snapPoints: {
    bottom: [0, 0.5, 1],
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
    },
  },
  initial: {},
  disabled: false,
}

export { defaultOptions }
