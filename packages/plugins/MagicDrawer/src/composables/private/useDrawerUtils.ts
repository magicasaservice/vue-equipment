export function useDrawerUtils() {
  function clamp(value: number, from: number, to: number) {
    if (from > to) {
      if (value > from) return value
      if (value < to) return to
      else return value
    } else if (from < to) {
      if (value < from) return value
      if (value > to) return to
      else return value
    } else {
      // Prevent overdragging, when overshoot is 0
      if (value < to) return to
      else return value
    }
  }

  return {
    clamp,
  }
}
