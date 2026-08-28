function lerp(from: number, to: number, amount: number): number {
  return (1 - amount) * from + amount * to
}

// Frame rate independent damping, normalized to a 60hz frame
export function damp(
  from: number,
  to: number,
  amount: number,
  delta: number
): number {
  return lerp(
    from,
    to,
    1 - Math.exp(Math.log(1 - amount) * (delta / (1000 / 60)))
  )
}

// The resting position of a value decelerating from `velocity` by `friction`
export function project(
  value: number,
  velocity: number,
  friction: number
): number {
  return value + velocity / (1 - friction)
}

export function round(value: number, precision: number = 0): number {
  const multiplier = Math.pow(10, precision)
  return Math.round(value * multiplier) / multiplier
}
