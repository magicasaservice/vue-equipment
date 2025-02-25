import { ref, shallowRef, watch, toValue, type MaybeRef, type Ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from '@maas/vue-equipment/utils'
import { usePlayerStateEmitter } from './usePlayerStateEmitter'
import { usePlayerMediaApi } from './usePlayerMediaApi'

export type UsePlayerVideoApiArgs = {
  id: MaybeRef<string>
  playerRef?: Ref<HTMLElement | null>
  videoRef?: Ref<HTMLVideoElement | null>
}

export function usePlayerVideoApi(args: UsePlayerVideoApiArgs) {
  // Private state
  const { id, playerRef, videoRef } = args

  const fullscreenTarget = ref<HTMLElement | null>(null)

  const { playing, currentTime, muted } = usePlayerMediaApi({ id })

  // Public state
  const touched = shallowRef(false)
  const mouseEntered = shallowRef(false)

  const { isFullscreen, enter, exit } = useFullscreen(fullscreenTarget)

  // Public functions
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

  function onMouseenter() {
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
  }

  function enterFullscreen() {
    if (!fullscreenTarget.value) {
      console.error('No fullscreen target found')
      return
    }

    enter()
  }

  function exitFullscreen() {
    if (!fullscreenTarget.value) {
      console.error('No fullscreen target found')
      return
    }

    exit()
  }

  // Lifecycle hooks and listeners
  watch(playing, (value) => {
    if (!touched.value && value) {
      touched.value = true
    }
  })

  if (playerRef && !videoRef) {
    watch(playerRef, (value) => {
      if (value) {
        fullscreenTarget.value = toValue(value)
      }
    })
  }

  if (videoRef && !playerRef) {
    watch(videoRef, (value) => {
      if (value) {
        fullscreenTarget.value = toValue(value)
      }
    })
  }

  if (videoRef && playerRef) {
    watch([playerRef, videoRef], ([player, video]) => {
      if (player && video) {
        fullscreenTarget.value = isIOS() ? toValue(video) : toValue(player)
      } else if (player) {
        fullscreenTarget.value = toValue(player)
      } else if (video) {
        fullscreenTarget.value = toValue(video)
      }
    })
  }

  const emitter = usePlayerStateEmitter()

  // Listen to updates
  emitter.on('update', (payload) => {
    if (payload.id !== toValue(id)) return

    if (payload.api === 'player') {
      switch (payload.key) {
        case 'mouseEntered':
          mouseEntered.value = payload.value as boolean
          break
        case 'fullscreenTarget':
          fullscreenTarget.value = payload.value as HTMLElement
          break
        case 'touched':
          touched.value = payload.value as boolean
          break
      }
    }
  })

  // Emit updates
  watch(mouseEntered, (value) => {
    emitter.emit('update', {
      id: toValue(id),
      api: 'player',
      key: 'mouseEntered',
      value,
    })
  })

  watch(touched, (value) => {
    emitter.emit('update', {
      id: toValue(id),
      api: 'player',
      key: 'touched',
      value,
    })
  })

  watch(fullscreenTarget, (value) => {
    if (!value) return

    emitter.emit('update', {
      id: toValue(id),
      api: 'player',
      key: 'fullscreenTarget',
      value,
    })
  })

  return {
    mouseEntered,
    isFullscreen,
    touched,
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
    enterFullscreen,
    exitFullscreen,
    onMouseenter,
    onMouseleave,
  }
}

export type UsePlayerVideoApiReturn = ReturnType<typeof usePlayerVideoApi>
