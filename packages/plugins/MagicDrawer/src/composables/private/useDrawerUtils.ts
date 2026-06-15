import { rubberband } from '@maas/vue-equipment/utils'

export function useDrawerUtils() {
  // Track the finger freely up to the `from` bound, then apply rubber-band
  // resistance toward the signed overshoot extreme `to` (asymptotic, never
  // reaching it). With no overshoot, conditionally prevent overdragging past
  // the bound based on the drag direction.
  function clamp(value: number, from: number, to: number, flip: boolean) {
    const overshoot = Math.abs(to)

    if (to < from) {
      return value < from
        ? from - rubberband(from - value, overshoot)
        : value
    } else if (to > from) {
      return value > from
        ? from + rubberband(value - from, overshoot)
        : value
    } else {
      // Prevent overdragging when overshoot is 0
      return flip ? Math.min(value, to) : Math.max(value, to)
    }
  }

  return {
    clamp,
  }
}
