import { ref, computed, watch, toValue } from 'vue'
import {
  useResizeObserver,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import { clampValue, mapValue } from '@maas/vue-equipment/utils'
import { usePlayerStore } from './usePlayerStore'

import type { UseControlsApiArgs } from '../../types'

export function useControlsApi(args: UseControlsApiArgs) {
  const { findInstance } = usePlayerStore()
  const instance = findInstance(toValue(args.id))

  const { buffered, duration, playing, currentTime } = instance.mediaApi
  const { play, pause, seek } = instance.playerApi

  // Public values
  const dragging = ref(false)
  const mouseEntered = ref(false)
  const seekedTime = ref(0)
  const seekedPercentage = ref(0)
  const scrubbedPercentage = ref(0)
  const thumbPercentage = ref(0)
  const popoverOffsetX = ref(0)

  const bufferedPercentage = computed(() => {
    if (!instance?.mediaApi) return 0

    const endBuffer = buffered.value?.length > 0 ? buffered.value[0][1] : 0
    const percentage = (endBuffer / duration.value) * 100
    return clampValue(percentage, 0, thumbPercentage.value)
  })

  // Private values
  const resumePlay = ref(false)
  const barRect = ref<DOMRect | undefined>(undefined)
  const trackRect = ref<DOMRect | undefined>(undefined)
  const popoverRect = ref<DOMRect | undefined>(undefined)

  // Private functions
  function getPopoverOffsetX() {
    if (!trackRect.value || !popoverRect.value || !barRect.value) {
      return 0
    } else {
      const trackFactor = barRect.value.width / trackRect.value.width

      const offsetXPercentage =
        (Math.abs(trackRect.value.x - barRect.value.x) / barRect.value.width) *
        100

      const popoverWidthPercentage =
        (popoverRect.value.width / barRect.value.width) * 100

      const maxPercentage = 100 - popoverWidthPercentage

      const percentage =
        seekedPercentage.value / trackFactor +
        offsetXPercentage -
        popoverWidthPercentage / 2

      popoverOffsetX.value = clampValue(percentage, 0, maxPercentage)
    }
  }

  function getTimelineTrackSize() {
    trackRect.value = toValue(args.trackRef)?.getBoundingClientRect()
    thumbPercentage.value =
      100 - (trackRect.value!.height / trackRect.value!.width) * 100
  }

  function getPopoverSizes() {
    barRect.value = toValue(args.barRef)?.getBoundingClientRect()
    popoverRect.value = toValue(args.popoverRef)?.getBoundingClientRect()
  }

  function seekToTrackPosition(absX: number) {
    if (!trackRect.value) {
      throw new Error('trackRect is undefined')
    }

    const relX = absX - trackRect.value!.x - trackRect.value!.height / 2
    const percentage = Math.round((relX / trackRect.value!.width) * 100)

    seekedPercentage.value = clampValue(percentage, 0, thumbPercentage.value)

    seekedTime.value =
      (duration.value *
        mapValue(seekedPercentage.value, 0, thumbPercentage.value, 0, 100)) /
      100

    if (dragging.value) {
      scrubbedPercentage.value = seekedPercentage.value
      seek(seekedTime.value)
    }

    // Update popover offset (side effect)
    getPopoverOffsetX()
  }

  // Public functions
  function onMouseenter() {
    getTimelineTrackSize()
    getPopoverSizes()
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
    dragging.value = false
    seekedTime.value = 0
  }

  function onPointerdown(e: MouseEvent | TouchEvent) {
    dragging.value = true
    resumePlay.value = playing.value
    pause()
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    seekToTrackPosition(x)
  }

  function onPointerup() {
    dragging.value = false
    if (resumePlay.value) {
      play()
    }
  }

  function onPointermove(e: MouseEvent | TouchEvent) {
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    seekToTrackPosition(x)
  }

  // Listener, observer, watcher
  watch(currentTime, (value) => {
    const percentage = (value / duration.value) * 100
    scrubbedPercentage.value = mapValue(
      percentage,
      0,
      100,
      0,
      thumbPercentage.value,
    )
  })

  useResizeObserver(args.trackRef, getTimelineTrackSize)
  useResizeObserver(args.popoverRef, getPopoverSizes)

  useEventListener(
    defaultWindow,
    'resize',
    () => {
      getTimelineTrackSize
      getPopoverSizes
    },
    {
      passive: true,
    },
  )

  return {
    mouseEntered,
    dragging,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    bufferedPercentage,
    thumbPercentage,
    popoverOffsetX,
    onMouseenter,
    onMouseleave,
    onPointerdown,
    onPointerup,
    onPointermove,
  }
}

export type UseControlsApiReturn = ReturnType<typeof useControlsApi>
