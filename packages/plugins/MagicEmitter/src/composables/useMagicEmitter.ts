import mitt from 'mitt'

import type { MagicEmitterEvents } from '../types/index'

const emitter = mitt<MagicEmitterEvents>()

export function useMagicEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
