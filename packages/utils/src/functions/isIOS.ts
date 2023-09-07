export function isIOS() {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator?.userAgent)
}
