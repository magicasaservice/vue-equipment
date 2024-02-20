import mitt from 'mitt'
import type { CommandEvents } from '../types'

const emitter = mitt<CommandEvents>()

export function useCommandEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
