import {
  toRefs,
  shallowRef,
  computed,
  watch,
  toValue,
  onScopeDispose,
  type MaybeRef,
  type Ref,
  type WatchHandle,
} from 'vue'
import {
  useResizeObserver,
  useEventListener,
  defaultWindow,
  type UseResizeObserverReturn,
  useThrottleFn,
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
  const { id, barRef, trackRef, popoverRef } = args

  // Private state
  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    currentTime,
    duration,
    dragging,
    touched,
    controlsMouseEntered,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
    playing,
    buffered,
    controlsBarRect,
    controlsTrackRect,
    controlsPopoverRect,
    hasControls,
  } = toRefs(state)

  const resumePlay = shallowRef(false)

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined

  // Public state
  const bufferedPercentage = computed(() => {
    if (!buffered.value) {
      return 0
    }

    const endBuffer =
      buffered.value?.length > 0 && buffered.value[0] ? buffered.value[0][1] : 0
    const percentage = (endBuffer / duration.value) * 100

    return clampValue(percentage, 0, thumbPercentage.value)
  })

  // Private functions
  const { play, pause, seek } = usePlayerVideoApi({ id })

  function getPopoverOffsetX() {
    if (
      !controlsTrackRect.value ||
      !controlsPopoverRect.value ||
      !controlsBarRect.value
    ) {
      return
    }

    const trackFactor =
      controlsBarRect.value.width / controlsTrackRect.value.width

    const offsetXPercentage =
      (Math.abs(controlsTrackRect.value.x - controlsBarRect.value.x) /
        controlsBarRect.value.width) *
      100

    const popoverWidthPercentage =
      (controlsPopoverRect.value.width / controlsBarRect.value.width) * 100

    const maxPercentage = 100 - popoverWidthPercentage

    const percentage =
      seekedPercentage.value / trackFactor +
      offsetXPercentage -
      popoverWidthPercentage / 2

    popoverOffsetX.value = clampValue(percentage, 0, maxPercentage)
  }

  function getTimelineTrackSize() {
    // Safe guard against undefined ref
    if (!toValue(trackRef)) {
      return
    }

    controlsTrackRect.value = toValue(trackRef)!.getBoundingClientRect()

    thumbPercentage.value =
      100 -
      (controlsTrackRect.value.height / controlsTrackRect.value.width) * 100
  }

  function getPopoverSizes() {
    // Safe guard against undefined refs
    if (!toValue(barRef) || !toValue(popoverRef)) {
      return
    }

    controlsBarRect.value = toValue(barRef)!.getBoundingClientRect()
    controlsPopoverRect.value = toValue(popoverRef)!.getBoundingClientRect()
  }

  function getSizes() {
    getTimelineTrackSize()
    getPopoverSizes()
    getPopoverOffsetX()
  }

  const getSizesThrottled = useThrottleFn(getSizes, 100)

  function seekToTrackPosition(absX: number) {
    if (!controlsTrackRect.value) {
      return
    }

    const relX =
      absX - controlsTrackRect.value.x - controlsTrackRect.value.height / 2
    const percentage = Math.round((relX / controlsTrackRect.value.width) * 100)

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

  function resetTimelineState() {
    seekedTime.value = null
    seekedPercentage.value = 0
    popoverOffsetX.value = null
  }

  function resetStateAndListeners() {
    dragging.value = false
    touched.value = false

    cancelTouchend?.()
    cancelPointerup?.()
    cancelPointermove?.()
  }

  function onPointerup(e: PointerEvent) {
    resetStateAndListeners()
    resetTimelineState()
    guardedReleasePointerCapture({ event: e, element: barRef?.value })
    if (resumePlay.value) {
      play()
    }
  }

  // Public functions
  function onPointermove(e: PointerEvent) {
    if (!e.isPrimary) {
      return
    }

    // Needs to happen here to avoid bugs with the player
    // inside a carousel or a scrollable container.
    getSizesThrottled()

    // Prevent event bubbling, helpful on iOS
    e.stopImmediatePropagation()
    e.stopPropagation()

    // Set track position
    seekToTrackPosition(e.clientX)
  }

  function onPointerdown(e: PointerEvent) {
    if (dragging.value) {
      return
    } else {
      // Capture pointer, update state, pause video
      guardedSetPointerCapture({ event: e, element: barRef?.value })
      resumePlay.value = playing.value
      dragging.value = true
      touched.value = true
      pause()

      // Update DOM Rect sizes
      getSizes()

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
    getSizes()
    controlsMouseEntered.value = true
  }

  function onMouseleave() {
    controlsMouseEntered.value = false
    if (!dragging.value) {
      resetTimelineState()
    }
  }

  function onMouseleaveTimeline() {
    if (!dragging.value) {
      resetTimelineState()
    }
  }

  // Lifecycle hooks and listeners
  let watchTrack: WatchHandle | null = null
  let watchPopover: WatchHandle | null = null
  let watchBar: WatchHandle | null = null
  let watchCurrentTime: WatchHandle | null = null
  let resizeObserverTrack: UseResizeObserverReturn | null = null
  let resizeObserverPopover: UseResizeObserverReturn | null = null
  let resizeObserverBar: UseResizeObserverReturn | null = null
  let windowResizeCleanup: ReturnType<typeof useEventListener> | null = null

  function initialize() {
    hasControls.value = true

    watchTrack = watch(() => trackRef, getTimelineTrackSize)
    watchPopover = watch(() => popoverRef, getPopoverSizes)
    watchBar = watch(() => barRef, getPopoverSizes)

    watchCurrentTime = watch(currentTime, (value) => {
      const percentage = (value / duration?.value) * 100
      scrubbedPercentage.value = mapValue(
        percentage,
        0,
        100,
        0,
        thumbPercentage.value
      )
    })

    resizeObserverTrack = useResizeObserver(trackRef, getTimelineTrackSize)
    resizeObserverPopover = useResizeObserver(popoverRef, getPopoverSizes)
    resizeObserverBar = useResizeObserver(barRef, getPopoverSizes)

    windowResizeCleanup = useEventListener(
      defaultWindow,
      'resize',
      () => {
        getSizes()
      },
      {
        passive: true,
      }
    )
  }

  function destroy() {
    watchTrack?.()
    watchPopover?.()
    watchBar?.()
    watchCurrentTime?.()
    resizeObserverTrack?.stop()
    resizeObserverPopover?.stop()
    resizeObserverBar?.stop()
    windowResizeCleanup?.()
    cancelPointermove?.()
    cancelPointerup?.()
    cancelTouchend?.()
  }

  onScopeDispose(() => {
    destroy()
  })

  return {
    initialize,
    destroy,
    bufferedPercentage,
    onMouseenter,
    onMouseleave,
    onMouseleaveTimeline,
    onPointerdown,
    onPointermove,
  }
}

export type UsePlayerControlsApiReturn = ReturnType<typeof usePlayerControlsApi>
