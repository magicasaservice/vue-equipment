import { toRefs, watch, unref, toValue, type Ref, type MaybeRef } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'
import { usePlayerState } from './usePlayerState'
import { usePlayerError } from './usePlayerError'

export type UsePlayerMediaApiArgs = {
  id: MaybeRef<string>
  mediaRef?: Ref<HTMLMediaElement | null>
}

export function usePlayerMediaApi(args: UsePlayerMediaApiArgs) {
  // Private state
  const { id, mediaRef } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    buffered,
    currentTime,
    duration,
    ended,
    loaded,
    muted,
    paused,
    playing,
    rate,
    seeking,
    stalled,
    started,
    volume,
    waiting,
  } = toRefs(state)

  const { handlePlayPromiseError, handleMediaElementError } = usePlayerError({
    id,
  })

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
    if (el) {
      el.volume = volume.value
    }
  })

  watch(muted, () => {
    const el = toValue(mediaRef)
    if (el) {
      el.muted = muted.value
    }
  })

  watch(rate, () => {
    const el = toValue(mediaRef)
    if (el) {
      el.playbackRate = rate.value
    }
  })

  if (toValue(mediaRef)) {
    watch([mediaRef], () => {
      const el = toValue(mediaRef)

      if (el) {
        el.volume = volume.value
        el.muted = muted.value
        el.playbackRate = rate.value
      }
    })
  }

  watch(loaded, () => {
    if (playing.value) {
      const el = toValue(mediaRef)
      if (el) {
        el.play()
      }
    }
  })

  // Ignorable watcher
  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(
    currentTime,
    (time) => {
      const el = toValue(mediaRef)

      if (el) {
        el.currentTime = unref(time)
      }
    }
  )

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (value) => {
      const el = toValue(mediaRef)

      if (!el) {
        return
      }

      if (value) {
        const playPromise = el.play()

        playPromise?.catch((error) => {
          // Reset state if play was rejected
          playing.value = false
          handlePlayPromiseError(error)
        })
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
    rate.value = toValue(mediaRef)?.playbackRate ?? rate.value
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
    paused.value = true
  })

  useEventListener(mediaRef, 'play', () => {
    playing.value = true
    started.value = true
  })

  useEventListener(mediaRef, 'volumechange', () => {
    const el = toValue(mediaRef)

    if (el) {
      volume.value = el.volume
      muted.value = el.muted
    }
  })

  useEventListener(mediaRef, 'error', () => {
    const el = toValue(mediaRef)

    if (el?.error) {
      handleMediaElementError(el.error)
    }
  })
}

export type UsePlayerMediaApiReturn = ReturnType<typeof usePlayerMediaApi>
