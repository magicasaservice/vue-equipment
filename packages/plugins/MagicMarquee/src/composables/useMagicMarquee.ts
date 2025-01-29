import { computed, type MaybeRef } from 'vue'
import { useMarqueeState } from './private/useMarqueeState'

export function useMagicMarquee(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = useMarqueeState(id)
  const state = initializeState()

  // Public state
  const isPlaying = computed(() => state.playing)

  // Public methods
  function play() {
    state.playing = true
  }

  function pause() {
    state.playing = false
  }

  function increaseSpeed(factor = 1) {
    if (!state.options.speed) {
      return
    }

    state.options.speed += factor
    console.log(state.id)
  }

  function decreaseSpeed(factor = 1) {
    if (!state.options.speed) {
      return
    }

    state.options.speed -= factor
  }

  function reverse() {
    switch (state.options.direction) {
      case 'reverse':
        state.options.direction = 'normal'
        break
      case 'normal':
        state.options.direction = 'reverse'
        break
    }
  }

  return {
    state,
    isPlaying,
    play,
    pause,
    increaseSpeed,
    decreaseSpeed,
    reverse,
  }
}

export type UseMagicMarqueeReturn = ReturnType<typeof useMagicMarquee>
