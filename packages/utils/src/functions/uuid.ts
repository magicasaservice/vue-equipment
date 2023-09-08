import crypto from 'crypto'
const isBrowser = typeof window !== 'undefined'

export function uuid() {
  return isBrowser ? window.crypto.randomUUID() : crypto.randomUUID()
}
