import { toRefs, watch, toValue, type MaybeRef, type Ref } from 'vue'
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
  const { currentTime, playing, paused, muted, fullscreenTarget } =
    toRefs(state)

  const { enter, exit } = useFullscreen(fullscreenTarget)

  // Public functions
  function play() {
    playing.value = true
    paused.value = false
  }

  function pause() {
    playing.value = false
    paused.value = true
  }

  function togglePlay() {
    playing.value = !playing.value
    paused.value = !playing.value
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
  // watch(playing, (value) => {
  //   if (!started.value && value) {
  //     started.value = true
  //   }
  // })

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
  }
}

export type UsePlayerVideoApiReturn = ReturnType<typeof usePlayerVideoApi>
