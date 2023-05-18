/**
 * Formats seconds as a time string
 *
 * @example  formatTime(125, 600) === "02:05"
 * @param    {number} seconds
 *           Number of seconds to be turned into a string
 *
 * @return   {string}
 *           Time formatted as H:MM:SS or M:SS
 */

export function formatTime(s: number): string {
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s - hours * 3600) / 60)
  const seconds = Math.floor(s - hours * 3600 - minutes * 60)
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
  return `${hours > 0 ? `${hours}:` : ''}${minutesString}:${secondsString}`
}
