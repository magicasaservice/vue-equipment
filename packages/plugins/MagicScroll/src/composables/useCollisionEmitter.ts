import mitt from 'mitt'
import type { CollisionEvents } from '../types'

const emitter = mitt<CollisionEvents>()

export function useCollisionEmitter() {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }
}
