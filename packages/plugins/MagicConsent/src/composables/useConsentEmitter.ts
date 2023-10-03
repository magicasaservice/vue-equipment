import mitt from 'mitt'
import type { ConsentEvents } from '../types'

const emitter = mitt<ConsentEvents>()

export function useConsentEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
