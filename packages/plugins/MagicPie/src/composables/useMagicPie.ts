import { toValue, toRefs, type MaybeRef } from 'vue'
import { interpolate, linear } from '@maas/vue-equipment/utils'
import { usePieState } from './private/usePieState'

interface InterpolatePercentageArgs {
  value: number
  duration: number
  easing?: (t: number) => number
}

export function useMagicPie(id: MaybeRef<string>) {
  // Private functions
  const { initializeState } = usePieState(toValue(id))
  const state = initializeState()
  const { percentage, interpolationId } = toRefs(state)

  // Public functions
  function setPercentage(value: number) {
    percentage.value = Math.min(Math.max(0, value), 100)
  }

  function interpolatePercentage(args: InterpolatePercentageArgs) {
    const { value, duration = 1000, easing = linear } = args

    // Clamp value
    const mappedValue = Math.min(Math.max(0, value), 100)

    // Cancel any running interpolations
    if (interpolationId.value) {
      cancelAnimationFrame(interpolationId.value)
    }

    // Calculate the remaining duration
    const mappedDuration = duration - (duration * percentage.value) / 100

    interpolationId.value = interpolate({
      from: percentage.value,
      to: mappedValue,
      duration: mappedDuration,
      easing,
      callback: (value: number) => {
        percentage.value = value
      },
      interpolationIdCallback: (id: number) => {
        interpolationId.value = id
      },
    })
  }

  function cancelInterpolatePercentage() {
    if (interpolationId.value) {
      cancelAnimationFrame(interpolationId.value)
      interpolationId.value = undefined
    }
  }

  return {
    percentage,
    setPercentage,
    interpolatePercentage,
    cancelInterpolatePercentage,
  }
}
