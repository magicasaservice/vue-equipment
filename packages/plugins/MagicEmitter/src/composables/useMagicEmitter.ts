import mitt, { type Emitter } from 'mitt'

import { createStateStore } from '@maas/vue-equipment/utils'
import type { MagicEmitterEvents } from '../types/index'

const getEmitter = createStateStore<Emitter<MagicEmitterEvents>>(() =>
  mitt<MagicEmitterEvents>()
)

export function useMagicEmitter() {
  const emitter = getEmitter()

  return {
    on: emitter.value.on,
    off: emitter.value.off,
    emit: emitter.value.emit,
  }
}
