// Maps overdrag distance onto a diminishing, ever-increasing offset that
// approaches `max` but never reaches it, so resistance always keeps growing.
// Higher `tightness` climbs toward the edge sooner while staying elastic.
export function rubberband(distance: number, max: number, tightness = 2) {
  if (max <= 0 || distance <= 0) {
    return 0
  }
  return (1 - 1 / ((distance * tightness) / max + 1)) * max
}

// The distance `rubberband` maps onto `offset`, 0 when there is none
export function rubberbandInverse(offset: number, max: number, tightness = 2) {
  if (offset <= 0 || offset >= max) {
    return 0
  }
  return (offset * max) / ((max - offset) * tightness)
}
