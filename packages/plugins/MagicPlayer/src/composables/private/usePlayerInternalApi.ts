import { ref, watch, toValue } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { isIOS } from '@maas/vue-equipment/utils'
import type { UsePlayerInternalApiArgs } from '../../types'
import { usePlayerStore } from './usePlayerStore'

export function usePlayerInternalApi(args: UsePlayerInternalApiArgs) {
  const touched = ref(false)
  const mouseEntered = ref(false)
  const fullscreenTarget = isIOS() ? args.videoRef : args.playerRef

  const { findInstance } = usePlayerStore()
  const instance = findInstance(toValue(args.id))

  const { currentTime, playing, muted } = instance.mediaApi

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

  function onMouseenter() {
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
  }

  watch(playing, () => {
    if (!touched.value) {
      touched.value = true
    }
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
    toggleFullscreen,
    onMouseenter,
    onMouseleave,
  }
}

export type UsePlayerInternalApiReturn = ReturnType<typeof usePlayerInternalApi>
