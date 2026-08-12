import { clampValue } from '@maas/vue-equipment/utils'
import { project } from './physics'
import type { CarouselState } from '../types'

type SnapArgs = {
  target: number
  velocity: number
  state: CarouselState
}

// The snap position nearest to the projected resting position
export function selectSnapPosition(args: SnapArgs): number {
  const { target, velocity, state } = args
  const { friction } = state.options.animation.momentum
  const { range, direction } = state.measurements

  const restingX = project(target, velocity, friction)

  if (!state.snapPositions.length) {
    const end = range * direction
    return clampValue(restingX, Math.min(end, 0), Math.max(end, 0))
  }

  return state.snapPositions.reduce((previous, current) =>
    Math.abs(current - restingX) < Math.abs(previous - restingX)
      ? current
      : previous
  )
}

export function shouldSnap(args: SnapArgs): boolean {
  const { target, velocity, state } = args
  const { friction } = state.options.animation.momentum

  if (!state.hasSnap || !state.snapPositions.length) {
    return false
  }

  if (state.snapMandatory) {
    return true
  }

  const restingX = project(target, velocity, friction)
  const snapportWidth = Math.max(
    state.measurements.width -
      state.measurements.scrollPaddingStart -
      state.measurements.scrollPaddingEnd,
    0
  )

  const proximityThreshold = snapportWidth / 3
  const nearestDistance = state.snapPositions.reduce(
    (distance, position) => Math.min(distance, Math.abs(position - restingX)),
    Number.POSITIVE_INFINITY
  )

  return nearestDistance <= proximityThreshold
}

// The velocity needed to come to rest on the nearest snap position
export function snapVelocity(args: SnapArgs): number {
  const { target, state } = args
  const { friction } = state.options.animation.momentum
  const { range, direction } = state.measurements

  const snapPosition = selectSnapPosition(args)
  const end = range * direction
  const clampedPosition = clampValue(
    snapPosition,
    Math.min(end, 0),
    Math.max(end, 0)
  )

  const distance = clampedPosition - target
  return distance * (1 - friction) * (1 / friction)
}
