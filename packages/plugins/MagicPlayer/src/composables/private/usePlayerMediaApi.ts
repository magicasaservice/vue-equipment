import {
  toRefs,
  watch,
  unref,
  toValue,
  type Ref,
  type MaybeRef,
  onScopeDispose,
} from 'vue'
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
  function timeupdateCallback() {
    ignoreCurrentTimeUpdates(
      () => (currentTime.value = toValue(mediaRef)!.currentTime)
    )
  }

  function durationChangeCallback() {
    duration.value = toValue(mediaRef)!.duration
  }

  function progressCallback() {
    buffered.value = timeRangeToArray(toValue(mediaRef)!.buffered)
  }

  function seekingCallback() {
    seeking.value = true
  }

  function seekedCallback() {
    seeking.value = false
  }

  function waitingLoadstartCallback() {
    waiting.value = true
    ignorePlayingUpdates(() => (playing.value = false))
  }

  function loadeddataCallback() {
    waiting.value = false
  }

  function playingCallback() {
    started.value = true
    waiting.value = false
    ended.value = false
    ignorePlayingUpdates(() => (playing.value = true))
  }

  function ratechangeCallback() {
    rate.value = toValue(mediaRef)?.playbackRate ?? rate.value
  }

  function stalledCallback() {
    stalled.value = true
  }

  function suspendCallback() {
    waiting.value = false
  }

  function endedCallback() {
    ended.value = true
  }

  function pauseCallback() {
    playing.value = false
    paused.value = true
  }

  function playCallback() {
    playing.value = true
    started.value = true
  }

  function volumechangeCallback() {
    const el = toValue(mediaRef)

    if (el) {
      volume.value = el.volume
      muted.value = el.muted
    }
  }

  function errorCallback() {
    const el = toValue(mediaRef)

    if (el?.error) {
      handleMediaElementError(el.error)
    }
  }

  const cancelTimeUpdate = useEventListener(
    mediaRef,
    'timeupdate',
    timeupdateCallback
  )
  const cancelDurationChange = useEventListener(
    mediaRef,
    'durationchange',
    durationChangeCallback
  )
  const cancelProgress = useEventListener(
    mediaRef,
    'progress',
    progressCallback
  )
  const cancelSeeking = useEventListener(mediaRef, 'seeking', seekingCallback)
  const cancelSeeked = useEventListener(mediaRef, 'seeked', seekedCallback)
  const cancelWaitingLoadstart = useEventListener(
    mediaRef,
    ['waiting', 'loadstart'],
    waitingLoadstartCallback
  )
  const cancelLoadeddata = useEventListener(
    mediaRef,
    'loadeddata',
    loadeddataCallback
  )
  const cancelPlaying = useEventListener(mediaRef, 'playing', playingCallback)
  const cancelRatechange = useEventListener(
    mediaRef,
    'ratechange',
    ratechangeCallback
  )
  const cancelStalled = useEventListener(mediaRef, 'stalled', stalledCallback)
  const cancelSuspend = useEventListener(mediaRef, 'suspend', suspendCallback)
  const cancelEnded = useEventListener(mediaRef, 'ended', endedCallback)
  const cancelPause = useEventListener(mediaRef, 'pause', pauseCallback)
  const cancelPlay = useEventListener(mediaRef, 'play', playCallback)
  const cancelVolumechange = useEventListener(
    mediaRef,
    'volumechange',
    volumechangeCallback
  )
  const cancelError = useEventListener(mediaRef, 'error', errorCallback)

  // Force cleanup on scope dispose
  onScopeDispose(() => {
    cancelTimeUpdate()
    cancelDurationChange()
    cancelProgress()
    cancelSeeking()
    cancelSeeked()
    cancelWaitingLoadstart()
    cancelLoadeddata()
    cancelPlaying()
    cancelRatechange()
    cancelStalled()
    cancelSuspend()
    cancelEnded()
    cancelPause()
    cancelPlay()
    cancelVolumechange()
    cancelError()
  }, true)
}

export type UsePlayerMediaApiReturn = ReturnType<typeof usePlayerMediaApi>
