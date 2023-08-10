import { ref, onMounted, computed, nextTick, watch } from 'vue'

import {
  useElementBounding,
  useResizeObserver,
  toValue,
  type MaybeRef,
} from '@vueuse/core'

export type UseMarqueeParams = {
  child: MaybeRef<HTMLElement | null | undefined>
  parent: MaybeRef<HTMLElement | null | undefined>
  options?: {
    speed?: MaybeRef<number>
    direction?: MaybeRef<'reverse' | 'normal'>
  }
}

export function useMarquee({ child, parent, options }: UseMarqueeParams) {
  // Private state
  const duplicates = ref(1)
  const childRect = useElementBounding(child)
  const parentRect = useElementBounding(parent)
  const duration = computed(() =>
    (childRect.width.value / toValue(speed) / 50).toFixed(2),
  )

  // Public state
  const playing = ref(true)

  // Reactive options
  const speed = computed(() => toValue(options?.speed) || 1)
  const direction = computed(() => toValue(options?.direction) || 'normal')

  function calculateDuplicates() {
    const childWidth = childRect?.width.value
    const parentWidth = parentRect?.width.value

    if (childWidth && parentWidth) {
      duplicates.value = Math.ceil((parentWidth / childWidth) * 2)
    }
  }

  function setCssVariables() {
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-duration',
      `${toValue(duration)}s`,
    )
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-name',
      `magicMarqueeScrollX`,
    )
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-direction',
      `${toValue(options?.direction) || 'normal'}`,
    )
  }

  function pause() {
    playing.value = false
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-play-state',
      'paused',
    )
  }

  function play() {
    playing.value = true
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-play-state',
      'running',
    )
  }

  onMounted(() => {
    calculateDuplicates()
    nextTick()
    setCssVariables()
  })

  useResizeObserver(parent, () => {
    childRect.update()
    parentRect.update()
    calculateDuplicates()
    nextTick()
    setCssVariables()
  })

  watch(speed, () => {
    nextTick()
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-duration',
      `${toValue(duration)}s`,
    )
  })

  watch(direction, (dir) => {
    nextTick()
    toValue(parent)?.style.setProperty(
      '--magic-marquee-animation-direction',
      `${toValue(dir)}`,
    )
  })

  return {
    duplicates,
    playing,
    play,
    pause,
  }
}
