import { toRefs, watch, toValue, type MaybeRef } from 'vue'
import { usePlayerState } from './usePlayerState'

export type UsePlayerAudioApiArgs = {
  id: MaybeRef<string>
}

export function usePlayerAudioApi(args: UsePlayerAudioApiArgs) {
  // Private state
  const { id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { touched, audioMouseEntered, currentTime, playing, muted } =
    toRefs(state)

  // Public state

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
    audioMouseEntered.value = true
  }

  function onMouseleave() {
    audioMouseEntered.value = false
  }

  // Lifecycle hooks and listeners
  watch(playing, (value) => {
    if (!touched.value && value) {
      touched.value = true
    }
  })

  return {
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
    onMouseenter,
    onMouseleave,
  }
}

export type UsePlayerAudioApiReturn = ReturnType<typeof usePlayerAudioApi>
