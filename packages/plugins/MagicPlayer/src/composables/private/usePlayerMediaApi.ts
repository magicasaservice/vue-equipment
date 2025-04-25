import { toRefs, watch, unref, toValue, type Ref, type MaybeRef } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'
import { usePlayerState } from './usePlayerState'

export type UsePlayerMediaApiArgs = {
  id: MaybeRef<string>
  mediaRef?: Ref<HTMLMediaElement | null>
}

export function usePlayerMediaApi(args: UsePlayerMediaApiArgs) {
  // Private state
  const { mediaRef, id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    currentTime,
    duration,
    seeking,
    volume,
    rate,
    waiting,
    started,
    ended,
    playing,
    stalled,
    buffered,
    muted,
  } = toRefs(state)

  // Private functions
  function timeRangeToArray(timeRanges: TimeRanges) {
    let ranges: [number, number][] = []
    for (let i = 0; i < timeRanges.length; ++i)
      ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]]
    return ranges
  }

  // Watcher
  watch(volume, () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.volume = volume.value
  })

  watch(muted, () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.muted = muted.value
  })

  watch(rate, () => {
    const el = toValue(mediaRef)
    if (!el) return

    el.playbackRate = rate.value
  })

  if (toValue(mediaRef)) {
    watch([mediaRef], () => {
      const el = toValue(mediaRef)
      if (!el) return

      el.volume = volume.value
      el.muted = muted.value
      el.playbackRate = rate.value
    })
  }

  // Ignorable watcher
  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(
    currentTime,
    (time) => {
      const el = toValue(mediaRef)
      if (!el) return
      el.currentTime = unref(time)
    }
  )

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (isPlaying) => {
      const el = toValue(mediaRef)
      if (!el) {
        return
      }

      if (isPlaying) {
        const playPromise = el.play()
        //eslint-disable-next-line
        if (playPromise !== undefined) playPromise.catch((error) => {})
      } else {
        el.pause()
      }
    }
  )

  // Listener
  useEventListener(mediaRef, 'timeupdate', () => {
    ignoreCurrentTimeUpdates(
      () => (currentTime.value = toValue(mediaRef)!.currentTime)
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
    started.value = true
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

  useEventListener(mediaRef, 'suspend', () => {
    waiting.value = false
  })

  useEventListener(mediaRef, 'ended', () => {
    ended.value = true
  })

  useEventListener(mediaRef, 'pause', () => {
    playing.value = false
  })

  useEventListener(mediaRef, 'play', () => {
    playing.value = true
    started.value = true
  })

  useEventListener(mediaRef, 'volumechange', () => {
    const el = toValue(mediaRef)
    if (!el) return
    volume.value = el.volume
    muted.value = el.muted
  })
}

export type UsePlayerMediaApiReturn = ReturnType<typeof usePlayerMediaApi>
