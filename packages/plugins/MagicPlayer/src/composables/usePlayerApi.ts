import { ref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from './../utils'
import type { MaybeRef } from '@vueuse/shared'
import type { UseMediaApiReturn } from './useMediaApi'

export function usePlayerApi(
  player: MaybeRef<HTMLElement | null | undefined>,
  video: MaybeRef<HTMLVideoElement | null | undefined>,
  mediaApi: UseMediaApiReturn
) {
  const touched = ref(false)
  const { currentTime, playing, muted } = mediaApi

  const fullscreenTarget = isIOS() ? video : player

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
