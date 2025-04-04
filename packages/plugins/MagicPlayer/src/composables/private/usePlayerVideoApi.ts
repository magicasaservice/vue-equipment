import { ref, toRefs, watch, toValue, type MaybeRef, type Ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from '@maas/vue-equipment/utils'
import { usePlayerState } from './usePlayerState'

export type UsePlayerVideoApiArgs = {
  id: MaybeRef<string>
  playerRef?: Ref<HTMLElement | null>
  videoRef?: Ref<HTMLVideoElement | null>
}

export function usePlayerVideoApi(args: UsePlayerVideoApiArgs) {
  // Private state
  const { id, playerRef, videoRef } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const {
    currentTime,
    playing,
    muted,
    touched,
    videoMouseEntered,
    fullscreenTarget,
  } = toRefs(state)

  const { enter, exit } = useFullscreen(fullscreenTarget)

  // Public functions
  function play() {
    playing.value = true
  }

  function pause() {
    playing.value = false
  }

  function togglePlay() {
    console.log('togglePlay', playing.value)
    playing.value = !playing.value
  }

  function seek(time: number) {
    currentTime.value = time
  }

  function mute() {
    muted.value = true
  }

  function unmute() {
    console.log('unmute', muted.value)
    muted.value = false
  }

  function onMouseenter() {
    videoMouseEntered.value = true
  }

  function onMouseleave() {
    videoMouseEntered.value = false
  }

  function enterFullscreen() {
    console.log('enterFullscreen', fullscreenTarget.value)
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

  return {
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
