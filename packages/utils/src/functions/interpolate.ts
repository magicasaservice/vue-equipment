export type InterpolateArgs = {
  from: number
  to: number
  duration: number
  easing?: (t: number) => number
  callback: (result: number) => void
  interpolationIdCallback?: (id: number) => void
}

export function interpolate(args: InterpolateArgs) {
  const {
    from,
    to,
    duration,
    callback,
    interpolationIdCallback = () => {},
    easing = (t) => t * (2 - t),
  } = args

  let startTime: number
  let interpolationId: number

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp

    const progress = Math.min(1, (timestamp - startTime) / duration)
    const easedProgress = easing(progress)
    const value = from + (to - from) * easedProgress

    callback(value)

    if (progress < 1) {
      interpolationId = requestAnimationFrame(animate)
      interpolationIdCallback(interpolationId)
    }
  }

  interpolationId = requestAnimationFrame(animate)

  return interpolationId
}
