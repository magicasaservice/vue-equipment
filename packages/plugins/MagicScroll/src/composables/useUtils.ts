export function useUtils() {
  const clampValue = (value: number, min: number, max: number) => {
    return value <= min ? min : value >= max ? max : value
  }

  const mapValue = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  return { clampValue, mapValue }
}
