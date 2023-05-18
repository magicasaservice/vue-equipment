import { ref, watch } from 'vue'
import type { MaybeRef } from '@vueuse/shared'
import { toValue, watchIgnorable } from '@vueuse/shared'
import { useEventListener } from '@vueuse/core'

export function useMediaApi(
  target: MaybeRef<HTMLMediaElement | null | undefined>
) {
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

  // Private Methods
  function timeRangeToArray(timeRanges: TimeRanges) {
    let ranges: [number, number][] = []
    for (let i = 0; i < timeRanges.length; ++i)
      ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]]
    return ranges
  }

  // Public Methods
  function play() {
    playing.value = true
  }

  function pause() {
    playing.value = false
  }

  function togglePlay() {
    playing.value = !playing.value
  }

  function seek(time: number) {
    currentTime.value = time
  }

  function mute() {
    muted.value = true
  }

  function unmute() {
    muted.value = false
  }

  // Watchers
  watch([target, volume], () => {
    const el = toValue(target)
    if (!el) return

    el.volume = volume.value
  })

  watch([target, muted], () => {
    const el = toValue(target)
    if (!el) return

    el.muted = muted.value
  })

  watch([target, rate], () => {
    const el = toValue(target)
    if (!el) return

    el.playbackRate = rate.value
  })

  // Ignorable Watchers
  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(
    currentTime,
    (time) => {
      const el = toValue(target)
      if (!el) return
      el.currentTime = time
    }
  )

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (isPlaying) => {
      const el = toValue(target)
      if (!el) return
      isPlaying ? el.play() : el.pause()
    }
  )

  useEventListener(target, 'timeupdate', () => {
    ignoreCurrentTimeUpdates(
      () => (currentTime.value = toValue(target)!.currentTime)
    )
  })

  useEventListener(target, 'durationchange', () => {
    duration.value = toValue(target)!.duration
  })

  useEventListener(target, 'progress', () => {
    buffered.value = timeRangeToArray(toValue(target)!.buffered)
  })

  useEventListener(target, 'seeking', () => {
    seeking.value = true
  })

  useEventListener(target, 'seeked', () => {
    seeking.value = false
  })

  useEventListener(target, ['waiting', 'loadstart'], () => {
    waiting.value = true
    ignorePlayingUpdates(() => (playing.value = false))
  })

  useEventListener(target, 'loadeddata', () => {
    waiting.value = false
  })

  useEventListener(target, 'playing', () => {
    waiting.value = false
    ended.value = false
    ignorePlayingUpdates(() => (playing.value = true))
  })

  useEventListener(target, 'ratechange', () => {
    rate.value = toValue(target)!.playbackRate
  })

  useEventListener(target, 'stalled', () => {
    stalled.value = true
  })

  useEventListener(target, 'ended', () => {
    ended.value = true
  })

  useEventListener(target, 'pause', () => {
    playing.value = false
  })

  useEventListener(target, 'play', () => {
    playing.value = true
  })

  useEventListener(target, 'volumechange', () => {
    const el = toValue(target)
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
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
  }
}

export type UseMediaApiReturn = ReturnType<typeof useMediaApi>
