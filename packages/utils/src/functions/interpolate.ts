export type InterpolateArgs = {
  from: number
  to: number
  duration: number
  interval?: number
  easing?: (t: number) => number
  callback: (result: number) => void
}

export function interpolate(args: InterpolateArgs) {
  const {
    from,
    to,
    duration,
    callback,
    easing = (t: number) => t * (2 - t),
    interval = 1,
  } = args

  const steps = Math.ceil(duration / interval)
  const stepSize = 1 / steps

  let currentStep = 0

  const intervalId = setInterval(() => {
    const progress = currentStep * stepSize
    const value = from + (to - from) * easing(progress)

    callback(value)
    currentStep++

    if (currentStep >= steps) {
      clearInterval(intervalId)
    }
  }, interval)
}
