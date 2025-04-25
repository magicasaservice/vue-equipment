import { toRefs, toValue, type MaybeRef } from 'vue'
import { usePlayerState } from './usePlayerState'

export type UsePlayerAudioApiArgs = {
  id: MaybeRef<string>
}

export function usePlayerAudioApi(args: UsePlayerAudioApiArgs) {
  // Private state
  const { id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { currentTime, playing, paused, muted } = toRefs(state)

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

  return {
    play,
    pause,
    togglePlay,
    seek,
    mute,
    unmute,
  }
}

export type UsePlayerAudioApiReturn = ReturnType<typeof usePlayerAudioApi>
