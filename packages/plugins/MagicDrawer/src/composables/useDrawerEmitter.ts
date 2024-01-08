import mitt from 'mitt'
import type { DrawerEvents } from '../types'

const emitter = mitt<DrawerEvents>()

export function useDrawerEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
