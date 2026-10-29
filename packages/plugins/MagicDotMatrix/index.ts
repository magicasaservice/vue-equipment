import MagicDotMatrix from './src/components/MagicDotMatrix.vue'
import { useMagicDotMatrix } from './src/composables/useMagicDotMatrix'
import { useMagicDotMatrixEmoji } from './src/composables/useMagicDotMatrixEmoji'
import type { App, Plugin } from 'vue'

import type {
  DotMatrixEmojiMotion,
  DotMatrixEvents,
  DotMatrixFrame,
  DotMatrixGrid,
  DotMatrixLayeredFrame,
  DotMatrixSequence,
  MagicDotMatrixEmojiOptions,
  MagicDotMatrixOptions,
} from './src/types'

const MagicDotMatrixPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDotMatrix', MagicDotMatrix)
  },
}

export * from './src/utils/presets/index'
export { equalizerFrame } from './src/utils/sequence/equalizerFrame'
export { getRings } from './src/utils/sequence/getRings'
export { ringPath } from './src/utils/sequence/ringPath'
export { toIndex } from './src/utils/sequence/toIndex'
export { withTrail } from './src/utils/sequence/withTrail'

export {
  MagicDotMatrixPlugin,
  MagicDotMatrix,
  useMagicDotMatrix,
  useMagicDotMatrixEmoji,
}
export type {
  DotMatrixEmojiMotion,
  DotMatrixEvents,
  DotMatrixFrame,
  DotMatrixGrid,
  DotMatrixLayeredFrame,
  DotMatrixSequence,
  MagicDotMatrixEmojiOptions,
  MagicDotMatrixOptions,
}
