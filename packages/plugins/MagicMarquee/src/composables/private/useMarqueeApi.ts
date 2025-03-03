import {
  shallowRef,
  computed,
  nextTick,
  watch,
  toValue,
  type MaybeRef,
} from 'vue'
import { useElementBounding, useElementSize, useThrottleFn } from '@vueuse/core'
import { useMarqueeState } from './useMarqueeState'

export type UseMarqueeApiParams = {
  child: MaybeRef<HTMLElement | null | undefined>
  parent: MaybeRef<HTMLElement | null | undefined>
  instanceId: MaybeRef<string>
}

export function useMarqueeApi({
  child,
  parent,
  instanceId,
}: UseMarqueeApiParams) {
  // Private state
  const { initializeState } = useMarqueeState(instanceId)
  const state = initializeState()

  const duplicates = shallowRef(1)
  const childRect = useElementBounding(child)
  const parentRect = useElementBounding(parent)

  const { width } = useElementSize(parent)

  const duration = computed(() =>
    (childRect.width.value / (toValue(state.options.speed) ?? 1) / 50).toFixed(
      2
    )
  )

  // Public state

  // Private functions
  function calculateDuplicates() {
    const childWidth = childRect?.width.value
    const parentWidth = parentRect?.width.value

    if (childWidth && parentWidth) {
      duplicates.value = Math.ceil((parentWidth / childWidth) * 2)
    }
  }

  function setCssVariables() {
    toValue(parent)?.style.setProperty(
      '--mm-animation-duration',
      `${toValue(duration)}s`
    )
    toValue(parent)?.style.setProperty('--mm-animation-name', 'mm-scroll-x')
    toValue(parent)?.style.setProperty(
      '--mm-animation-direction',
      `${toValue(state.options?.direction) || 'normal'}`
    )
  }

  // Public functions
  function pause() {
    toValue(parent)?.style.setProperty('--mm-animation-play-state', 'paused')
  }

  function play() {
    toValue(parent)?.style.setProperty('--mm-animation-play-state', 'running')
  }

  async function initialize() {
    calculateDuplicates()
    await nextTick()
    setCssVariables()
  }

  watch(
    width,
    useThrottleFn(() => {
      childRect.update()
      parentRect.update()
      calculateDuplicates()
      nextTick()
      setCssVariables()
    }, 100)
  )

  watch(
    () => state.options.speed,
    () => {
      nextTick()
      toValue(parent)?.style.setProperty(
        '--mm-animation-duration',
        `${toValue(duration)}s`
      )
    }
  )

  watch(
    () => state.options.direction,
    (dir) => {
      nextTick()
      toValue(parent)?.style.setProperty(
        '--mm-animation-direction',
        `${toValue(dir)}`
      )
    }
  )

  watch(
    () => state.playing,
    (value) => {
      switch (value) {
        case true:
          play()
          break
        case false:
          pause()
          break
      }
    }
  )

  return {
    duplicates,
    play,
    pause,
    initialize,
  }
}
