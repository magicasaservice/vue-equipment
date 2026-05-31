export function useDrawerUtils() {
  function clamp(value: number, from: number, to: number, flip: boolean) {
    if (from > to) {
      if (value > from) {
        return value
      }
      if (value < to) {
        return to
      } else {
        return value
      }
    } else if (from < to) {
      if (value < from) {
        return value
      }
      if (value > to) {
        return to
      } else {
        return value
      }
    } else {
      // Prevent overdragging, when overshoot is 0
      // Flip conditionally clamps value to the "to" value, based on direction of dragging
      switch (flip) {
        case true:
          return value > to ? to : value
        case false:
          return value < to ? to : value
        default:
          return value < to ? to : value
      }
    }
  }

  return {
    clamp,
  }
}
