/**
 * Formats seconds as a time string (H:MM:SS or M:SS). Supplying a
 * guide (in seconds) will force a number of leading zeros to cover the
 * length of the guide.
 *
 * @example  formatTime(125, 600) === "02:05"
 * @param    {number} seconds
 *           Number of seconds to be turned into a string
 *
 * @param    {number} guide
 *           Number (in seconds) to model the string after
 *
 * @return   {string}
 *           Time formatted as H:MM:SS or M:SS
 */

export function formatTime(seconds: number, guide: number = 0): string {
  seconds = seconds < 0 ? 0 : seconds
  let s: number = Math.round(seconds % 60)
  let m: number = Math.floor((seconds / 60) % 60)
  let h: number = Math.floor(seconds / 3600)
  const gm = Math.floor((guide / 60) % 60)
  const gh = Math.floor(guide / 3600)

  // handle invalid times
  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this
    // setting will add the minimum number of fields specified by the
    // guide
    h = m = s
  }

  // Check if we need to show hours
  const _hours = h > 0 || gh > 0 ? h + ':' : ''

  // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.
  const _minutes = ((h || gm >= 10) && m < 10 ? '0' + m : m) + ':'

  // Check if leading zero is needed for seconds
  const _seconds = s < 10 ? '0' + s : s

  return _hours + _minutes + _seconds
}
