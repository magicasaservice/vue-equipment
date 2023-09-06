import mitt from 'mitt'
import type { ToastEvents } from '../types'

const emitter = mitt<ToastEvents>()

export function useToastEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
