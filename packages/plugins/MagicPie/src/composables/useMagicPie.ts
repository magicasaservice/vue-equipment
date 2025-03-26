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
  const { percentage, animation } = toRefs(state)

  // Public functions
  function setPercentage(value: number) {
    percentage.value = Math.min(Math.max(0, value), 100)
  }

  function interpolatePercentage(args: InterpolatePercentageArgs) {
    const { value, duration = 1000, easing = linear } = args

    // Clamp value
    const mappedValue = Math.min(Math.max(0, value), 100)

    // Cancel any running animations
    if (animation.value) {
      cancelAnimationFrame(animation.value)
    }

    // Calculate the remaining duration
    const mappedDuration = duration - (duration * percentage.value) / 100

    animation.value = interpolate({
      from: percentage.value,
      to: mappedValue,
      duration: mappedDuration,
      easing,
      callback: (value: number) => {
        percentage.value = value
      },
      animationIdCallback: (id: number) => {
        animation.value = id
      },
    })
  }

  function cancelInterpolatePercentage() {
    if (animation.value) {
      cancelAnimationFrame(animation.value)
      animation.value = undefined
    }
  }

  return {
    percentage,
    setPercentage,
    interpolatePercentage,
    cancelInterpolatePercentage,
  }
}
