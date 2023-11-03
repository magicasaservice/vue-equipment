import { ref, watch, unref, toValue } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'
import type { UseMediaApiArgs } from '../../types'

export function useMediaApi(args: UseMediaApiArgs) {
  // Public values
  const currentTime = ref(0)
  const duration = ref(0)
  const seeking = ref(false)
  const volume = ref(1)
  const rate = ref(1)
  const waiting = ref(false)
  const ended = ref(false)
  const playing = ref(false)
  const stalled = ref(false)
  const buffered = ref<[number, number][]>([])
  const muted = ref(false)

  const { mediaRef } = args

  // Private functions
  function timeRangeToArray(timeRanges: TimeRanges) {
    let ranges: [number, number][] = []
    for (let i = 0; i < timeRanges.length; ++i)
      ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]]
    return ranges
  }

  // Watcher
  watch([mediaRef, volume], () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.volume = volume.value
  })

  watch([mediaRef, muted], () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.muted = muted.value
  })

  watch([mediaRef, rate], () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.playbackRate = rate.value
  })

  // Ignorable watcher
  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(
    currentTime,
    (time) => {
      const el = toValue(mediaRef)
      if (!el) return
      el.currentTime = unref(time)
    },
  )

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (isPlaying) => {
      const el = toValue(mediaRef)
      if (!el) return
      isPlaying ? el.play() : el.pause()
    },
  )

  // Listener
  useEventListener(mediaRef, 'timeupdate', () => {
    ignoreCurrentTimeUpdates(
      () => (currentTime.value = toValue(mediaRef)!.currentTime),
    )
  })

  useEventListener(mediaRef, 'durationchange', () => {
    duration.value = toValue(mediaRef)!.duration
  })

  useEventListener(mediaRef, 'progress', () => {
    buffered.value = timeRangeToArray(toValue(mediaRef)!.buffered)
  })

  useEventListener(mediaRef, 'seeking', () => {
    seeking.value = true
  })

  useEventListener(mediaRef, 'seeked', () => {
    seeking.value = false
  })

  useEventListener(mediaRef, ['waiting', 'loadstart'], () => {
    waiting.value = true
    ignorePlayingUpdates(() => (playing.value = false))
  })

  useEventListener(mediaRef, 'loadeddata', () => {
    waiting.value = false
  })

  useEventListener(mediaRef, 'playing', () => {
    waiting.value = false
    ended.value = false
    ignorePlayingUpdates(() => (playing.value = true))
  })

  useEventListener(mediaRef, 'ratechange', () => {
    rate.value = toValue(mediaRef)!.playbackRate
  })

  useEventListener(mediaRef, 'stalled', () => {
    stalled.value = true
  })

  useEventListener(mediaRef, 'ended', () => {
    ended.value = true
  })

  useEventListener(mediaRef, 'pause', () => {
    playing.value = false
  })

  useEventListener(mediaRef, 'play', () => {
    playing.value = true
  })

  useEventListener(mediaRef, 'volumechange', () => {
    const el = toValue(mediaRef)
    if (!el) return
    volume.value = el.volume
    muted.value = el.muted
  })

  return {
    currentTime,
    duration,
    waiting,
    seeking,
    ended,
    stalled,
    buffered,
    playing,
    rate,
    volume,
    muted,
  }
}

export type UseMediaApiReturn = ReturnType<typeof useMediaApi>
