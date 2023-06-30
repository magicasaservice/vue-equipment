import mitt from 'mitt'
import type { CollisionEvents } from '../types'

const emitter = mitt<CollisionEvents>()

export const magicScrollEmit = {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
}

export function clampValue(value: number, min: number, max: number) {
  return value <= min ? min : value >= max ? max : value
}

export function mapValue(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
