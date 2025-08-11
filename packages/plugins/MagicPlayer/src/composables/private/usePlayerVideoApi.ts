import { toRefs, watch, toValue, type MaybeRef, type Ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from '@maas/vue-equipment/utils'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { usePlayerState } from './usePlayerState'

export type UsePlayerVideoApiArgs = {
  id: MaybeRef<string>
  playerRef?: Ref<HTMLElement | null>
  videoRef?: Ref<HTMLVideoElement | null>
}

export function usePlayerVideoApi(args: UsePlayerVideoApiArgs) {
  // Private state
  const { id, playerRef, videoRef } = args

  const { logError } = useMagicError({
    prefix: 'MagicPlayer',
    source: 'MagicPlayer',
  })

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { currentTime, playing, paused, muted, fullscreenTarget, fullscreen } =
    toRefs(state)

  const { enter, exit, isFullscreen } = useFullscreen(fullscreenTarget)

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

  function initializeFullscreen() {
    if (!playerRef || !videoRef) {
      return
    }

    watch(
      [playerRef, videoRef],
      ([player, video]) => {
        switch (true) {
          case !!video && !!player:
            fullscreenTarget.value = isIOS() ? toValue(video) : toValue(player)
            break
          case !!player:
            fullscreenTarget.value = toValue(player)
            break
          case !!video:
            fullscreenTarget.value = toValue(video)
            break
        }
      },
      {
        immediate: true,
      }
    )

    watch(
      isFullscreen,
      (newFullscreen) => {
        fullscreen.value = newFullscreen
      },
      {
        immediate: true,
      }
    )
  }

  function enterFullscreen() {
    if (!fullscreenTarget.value) {
      logError('No fullscreen target found')
      return
    }

    enter()
  }

  function exitFullscreen() {
    if (!fullscreenTarget.value) {
      logError('No fullscreen target found')
      return
    }

    exit()
  }

  return {
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
    initializeFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}

export type UsePlayerVideoApiReturn = ReturnType<typeof usePlayerVideoApi>
