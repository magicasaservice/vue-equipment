import { ref, computed, watch, unref, toValue, type MaybeRef } from 'vue'
import { useEventListener, watchIgnorable } from '@vueuse/core'
import { usePlayerStateEmitter } from './usePlayerStateEmitter'
import type { Buffered } from '../../types'

export type UsePlayerMediaApiArgs = {
  id: MaybeRef<string>
  mediaRef?: MaybeRef<HTMLMediaElement | undefined>
}

export function usePlayerMediaApi(args: UsePlayerMediaApiArgs) {
  // Public state
  const currentTime = ref(0)
  const duration = ref(0)
  const seeking = ref(false)
  const volume = ref(1)
  const rate = ref(1)
  const waiting = ref(false)
  const ended = ref(false)
  const playing = ref(false)
  const stalled = ref(false)
  const buffered = ref<Buffered>([])
  const muted = ref(false)

  const { mediaRef } = args

  const formattedCurrentTime = computed(() => formatTime(currentTime.value))

  // Private functions
  function formatTime(currentTime: number): {
    hours: number
    minutes: number
    seconds: number
  } {
    const hours = Math.floor(currentTime / 3600)
    const minutes = Math.floor((currentTime % 3600) / 60)
    const seconds = Math.floor(currentTime % 60)

    return { hours, minutes, seconds }
  }

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
      if (!el) return
      isPlaying ? el.play() : el.pause()
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

  const emitter = usePlayerStateEmitter()

  // Listen to updates
  emitter.on('update', (payload) => {
    if (payload.id !== toValue(args.id)) return

    if (payload.api === 'media') {
      switch (payload.key) {
        case 'currentTime':
          currentTime.value = payload.value as number
          break
        case 'duration':
          duration.value = payload.value as number
          break
        case 'seeking':
          seeking.value = payload.value as boolean
          break
        case 'volume':
          volume.value = payload.value as number
          break
        case 'rate':
          rate.value = payload.value as number
          break
        case 'waiting':
          waiting.value = payload.value as boolean
          break
        case 'ended':
          ended.value = payload.value as boolean
          break
        case 'playing':
          playing.value = payload.value as boolean
          break
        case 'stalled':
          stalled.value = payload.value as boolean
          break
        case 'buffered':
          buffered.value = payload.value as Buffered
          break
        case 'muted':
          muted.value = payload.value as boolean
          break
      }
    }
  })

  // Emit updates
  watch(currentTime, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'currentTime',
      value,
    })
  })

  watch(duration, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'duration',
      value,
    })
  })

  watch(seeking, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'seeking',
      value,
    })
  })

  watch(volume, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'volume',
      value,
    })
  })

  watch(rate, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'rate',
      value,
    })
  })

  watch(waiting, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'waiting',
      value,
    })
  })

  watch(ended, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'ended',
      value,
    })
  })

  watch(playing, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'playing',
      value,
    })
  })

  watch(stalled, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'stalled',
      value,
    })
  })

  watch(buffered, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'buffered',
      value,
    })
  })

  watch(muted, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'media',
      key: 'muted',
      value,
    })
  })

  return {
    currentTime,
    formattedCurrentTime,
    duration,
    seeking,
    volume,
    rate,
    waiting,
    ended,
    playing,
    stalled,
    buffered,
    muted,
  }
}

export type UsePlayerMediaApiReturn = ReturnType<typeof usePlayerMediaApi>
