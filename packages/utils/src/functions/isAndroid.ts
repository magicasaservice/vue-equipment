export function isAndroid() {
  if (typeof window === 'undefined') {
    return false
  }
  return /android/i.test(navigator?.userAgent)
}
