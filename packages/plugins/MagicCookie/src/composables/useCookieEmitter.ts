import mitt from 'mitt'
import type { CookieEvents } from '../types'

const emitter = mitt<CookieEvents>()

export function useCookieEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
