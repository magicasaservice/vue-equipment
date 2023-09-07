export function formatTime(s: number): string {
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s - hours * 3600) / 60)
  const seconds = Math.floor(s - hours * 3600 - minutes * 60)
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
  return `${hours > 0 ? `${hours}:` : ''}${minutesString}:${secondsString}`
}
