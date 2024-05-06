export function linear(t: number) {
  return t
}
export function easeInQuad(t: number) {
  return t * t
}
export function easeOutQuad(t: number) {
  return t * (2 - t)
}
export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
export function easeOutBack(t: number, o: number = 1.25) {
  return 1 + (t - 1) * (t - 1) * ((o + 1) * (t - 1) + o)
}
export function easeInCubic(t: number) {
  return t * t * t
}
export function easeOutCubic(t: number) {
  return --t * t * t + 1
}
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
export function easeInQuart(t: number) {
  return t * t * t * t
}
export function easeOutQuart(t: number) {
  return 1 - --t * t * t * t
}
export function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
}
export function easeInQuint(t: number) {
  return t * t * t * t * t
}
export function easeOutQuint(t: number) {
  return 1 + --t * t * t * t * t
}
export function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}
