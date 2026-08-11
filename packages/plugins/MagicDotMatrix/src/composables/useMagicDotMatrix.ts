import { computed, type MaybeRef } from 'vue'
import { useDotMatrixState } from './private/useDotMatrixState'

export function useMagicDotMatrix(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useDotMatrixState(id)
  const state = initializeState()

  // Public state
  const isPlaying = computed(() => state.playing)
  const currentFrame = computed(() => state.frame)

  // Public functions
  function play() {
    state.playing = true
  }

  function pause() {
    state.playing = false
  }

  function restart() {
    state.frame = 0
    state.loops = 0
    state.playing = true
  }

  return {
    state,
    isPlaying,
    currentFrame,
    play,
    pause,
    restart,
  }
}

export type UseMagicDotMatrixReturn = ReturnType<typeof useMagicDotMatrix>
