import mitt from 'mitt'
import type { ModalEvents } from '../types'

const emitter = mitt<ModalEvents>()

export function useModalEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
