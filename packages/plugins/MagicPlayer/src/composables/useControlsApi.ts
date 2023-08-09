import { ref, computed, watch } from 'vue'
import {
  toValue,
  useResizeObserver,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import { clampValue, mapValue } from './../utils'
import { useInjectPlayer } from './usePlayer'

import type { UseControlsArgs } from '../types'

export function useControlsApi(args: UseControlsArgs) {
  const { mediaApi, playerApi } = useInjectPlayer()
  const { playing, buffered, duration, currentTime } = mediaApi
  const { play, pause, seek } = playerApi

  // Public values
  const entered = ref(false)
  const dragging = ref(false)
  const seekedTime = ref(0)
  const seekedPercentage = ref(0)
  const scrubbedPercentage = ref(0)
  const thumbPercentage = ref(0)
  const popoverOffsetX = ref(0)

  const bufferedPercentage = computed(() => {
    const endBuffer = buffered.value.length > 0 ? buffered.value[0][1] : 0
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
  function onMouseEnter() {
    getTimelineTrackSize()
    getPopoverSizes()
    entered.value = true
  }

  function onMouseLeave() {
    entered.value = false
    dragging.value = false
    seekedTime.value = 0
  }

  function onPointerDown(e: MouseEvent | TouchEvent) {
    dragging.value = true
    resumePlay.value = playing.value
    pause()
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    seekToTrackPosition(x)
  }

  function onPointerUp() {
    dragging.value = false
    if (resumePlay.value) {
      play()
    }
  }

  function onPointerMove(e: MouseEvent | TouchEvent) {
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
    entered,
    dragging,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    bufferedPercentage,
    thumbPercentage,
    popoverOffsetX,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onPointerUp,
    onPointerMove,
  }
}

export type UseControlsApiReturn = ReturnType<typeof useControlsApi>
