export type InterpolateArgs = {
  from: number
  to: number
  duration: number
  interval?: number
  easing?: (t: number) => number
  callback: (result: number) => void
}

export function interpolate(args: InterpolateArgs) {
  const { from, to, duration, callback, easing = (t) => t * (2 - t) } = args

  let startTime: number

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp

    const progress = Math.min(1, (timestamp - startTime) / duration)
    const easedProgress = easing(progress)
    const value = from + (to - from) * easedProgress

    callback(value)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
