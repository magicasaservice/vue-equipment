import { toRefs, watch, unref, toValue, type Ref, type MaybeRef } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { usePlayerState } from './usePlayerState'

export type UsePlayerMediaApiArgs = {
  id: MaybeRef<string>
  mediaRef?: Ref<HTMLMediaElement | null>
}

export function usePlayerMediaApi(args: UsePlayerMediaApiArgs) {
  // Private state
  const { id, mediaRef } = args

  const { throwError } = useMagicError({
    prefix: 'MagicPlayer',
    source: 'usePlayerMediaApi',
  })

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

  // Error handling functions
  function handlePlayPromiseError(originalError: Error) {
    let message = 'Play promise was rejected'
    let errorCode = 'play_promise_rejected'

    switch (originalError.name) {
      case 'AbortError':
        message = 'The play() request was aborted'
        errorCode = 'play_promise_aborted'
        break
      case 'NotAllowedError':
        message = 'Autoplay was prevented, user interaction required'
        errorCode = 'play_promise_not_allowed'
        break
      case 'NotSupportedError':
        message = 'Media format not supported'
        errorCode = 'play_promise_not_supported'
        break
    }

    throwError({ message, errorCode, cause: originalError })
  }

  function handleMediaElementError(originalError: MediaError) {
    let message = 'Media element error'
    let errorCode = 'media_element_error'

    switch (originalError.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        message = 'Media loading was aborted by the user'
        errorCode = 'media_element_aborted'
        break
      case MediaError.MEDIA_ERR_NETWORK:
        message = 'A network error occurred while loading the media'
        errorCode = 'media_element_network'
        break
      case MediaError.MEDIA_ERR_DECODE:
        message = 'An error occurred while decoding the media'
        errorCode = 'media_element_decode'
        break
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        message = 'The media source is not supported'
        errorCode = 'media_element_src_not_supported'
        break
    }

    throwError({ message, errorCode, cause: originalError })
  }

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
