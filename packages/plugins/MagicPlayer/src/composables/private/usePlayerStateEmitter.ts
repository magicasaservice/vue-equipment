import mitt from 'mitt'
import type { PlayerPrivateEvents } from '../../types'

const emitter = mitt<PlayerPrivateEvents>()

export function usePlayerStateEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
