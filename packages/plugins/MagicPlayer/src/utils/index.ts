export function formatTime(s: number): string {
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s - hours * 3600) / 60)
  const seconds = Math.floor(s - hours * 3600 - minutes * 60)
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
  return `${hours > 0 ? `${hours}:` : ''}${minutesString}:${secondsString}`
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

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}
