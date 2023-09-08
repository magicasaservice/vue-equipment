export const crypto =
  typeof window === 'undefined' ? require('crypto') : window.crypto
