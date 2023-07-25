import { ref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from './../utils'
import type { UseMediaApiReturn } from './useMediaApi'
import type { UsePlayerArgs } from '../types'

type UsePlayerApiArgs = Pick<UsePlayerArgs, 'playerRef' | 'videoRef'> & {
  mediaApi: UseMediaApiReturn
}

export function usePlayerApi(args: UsePlayerApiArgs) {
  const touched = ref(false)
  const fullscreenTarget = isIOS() ? args.videoRef : args.playerRef

  const { currentTime, playing, muted } = args.mediaApi
  const {
    isFullscreen,
    enter: enterFullscreen,
    exit: exitFullscreen,
    toggle: toggleFullscreen,
  } = useFullscreen(fullscreenTarget)

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

  watch(playing, () => {
    if (!touched.value) {
      touched.value = true
    }
  })

  return {
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
    toggleFullscreen,
  }
}

export type UsePlayerApiReturn = ReturnType<typeof usePlayerApi>
