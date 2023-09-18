import crypto from 'crypto'

export function uuid() {
  return typeof window !== 'undefined'
    ? window.crypto.randomUUID()
    : crypto.randomUUID()
}
