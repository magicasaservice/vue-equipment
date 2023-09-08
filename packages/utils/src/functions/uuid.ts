import crypto from 'crypto'
const isBrowser = typeof window !== 'undefined'

export const uuid = isBrowser ? window.crypto.randomUUID : crypto.randomUUID
