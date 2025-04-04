import {
  ref,
  toRefs,
  shallowRef,
  computed,
  watch,
  toValue,
  type MaybeRef,
  type Ref,
} from 'vue'
import {
  useResizeObserver,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import {
  isIOS,
  guardedReleasePointerCapture,
  guardedSetPointerCapture,
} from '@maas/vue-equipment/utils'
import { clampValue, mapValue } from '@maas/vue-equipment/utils'
import { usePlayerVideoApi } from './usePlayerVideoApi'
import { usePlayerState } from './usePlayerState'

export type UsePlayerControlsApiArgs = {
  id: MaybeRef<string>
  barRef?: Ref<HTMLDivElement | null>
  trackRef?: Ref<HTMLDivElement | null>
  popoverRef?: Ref<HTMLDivElement | null>
}

export function usePlayerControlsApi(args: UsePlayerControlsApiArgs) {
  const { id, trackRef, barRef, popoverRef } = args

  // Private state
  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    currentTime,
    duration,
    dragging,
    controlsMouseEntered,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
    playing,
    buffered,
    barRect,
    trackRect,
    popoverRect,
  } = toRefs(state)

  const resumePlay = shallowRef(false)

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined

  // Public state
  const bufferedPercentage = computed(() => {
    if (!buffered) return 0

    const endBuffer = buffered.value?.length > 0 ? buffered.value[0][1] : 0
    const percentage = (endBuffer / duration.value) * 100
    return clampValue(percentage, 0, thumbPercentage.value)
  })

  // Private functions
  const { play, pause, seek } = usePlayerVideoApi({ id })

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
    // Safe guard against undefined ref
    if (!toValue(trackRef)) {
      return
    }

    trackRect.value = toValue(trackRef)!.getBoundingClientRect()
    thumbPercentage.value =
      100 - (trackRect.value.height / trackRect.value.width) * 100
  }

  function getPopoverSizes() {
    // Safe guard against undefined refs
    if (!toValue(barRef) || !toValue(popoverRef)) {
      return
    }

    barRect.value = toValue(barRef)!.getBoundingClientRect()
    popoverRect.value = toValue(popoverRef)!.getBoundingClientRect()
  }

  function getSizes() {
    getTimelineTrackSize()
    getPopoverSizes()
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

  function resetStateAndListeners() {
    dragging.value = false
    cancelTouchend?.()
    cancelPointerup?.()
    cancelPointermove?.()
  }

  function onPointerup(e: PointerEvent) {
    resetStateAndListeners()
    guardedReleasePointerCapture({ event: e, element: trackRef?.value })
    if (resumePlay.value) {
      play()
    }
  }

  function onPointermove(e: PointerEvent) {
    if (!e.isPrimary) {
      return
    }

    // Update DomRect values
    getSizes()

    // Set track position
    seekToTrackPosition(e.clientX)
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    if (dragging.value) {
      return
    } else {
      // Capture pointer, update state, pause video
      guardedSetPointerCapture({ event: e, element: trackRef?.value })
      resumePlay.value = playing.value
      dragging.value = true
      pause()

      // Add listeners
      cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
      cancelPointermove = useEventListener(
        document,
        'pointermove',
        onPointermove,
        { passive: false }
      )

      // Pointerup doesn’t fire on iOS, so we need to use touchend
      cancelTouchend = isIOS()
        ? useEventListener(document, 'touchend', onPointerup)
        : undefined

      // Set initial transform
      onPointermove(e)
    }
  }

  function onMouseenter() {
    getTimelineTrackSize()
    getPopoverSizes()
    controlsMouseEntered.value = true
  }

  function onMouseleave() {
    controlsMouseEntered.value = false
    seekedTime.value = 0
  }

  // Lifecycle hooks and listeners
  watch(() => trackRef, getTimelineTrackSize)
  watch(() => popoverRef, getPopoverSizes)
  watch(() => barRef, getPopoverSizes)

  watch(currentTime, (value) => {
    const percentage = (value / duration?.value) * 100
    scrubbedPercentage.value = mapValue(
      percentage,
      0,
      100,
      0,
      thumbPercentage.value
    )
  })

  useResizeObserver(trackRef, getTimelineTrackSize)
  useResizeObserver(popoverRef, getPopoverSizes)

  useEventListener(
    defaultWindow,
    'resize',
    () => {
      getTimelineTrackSize()
      getPopoverSizes()
    },
    {
      passive: true,
    }
  )

  return {
    bufferedPercentage,
    onMouseenter,
    onMouseleave,
    onPointerdown,
  }
}

export type UsePlayerControlsApiReturn = ReturnType<typeof usePlayerControlsApi>
