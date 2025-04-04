import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import type { PlayerState } from '../../types/index'

const playerStateStore: Ref<PlayerState[]> = ref([])

export function usePlayerState(id: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: PlayerState = {
      id: id,
      currentTime: 0,
      duration: 0,
      seeking: false,
      volume: 1,
      rate: 1,
      loaded: false,
      waiting: false,
      ended: false,
      playing: false,
      stalled: false,
      buffered: [],
      muted: false,
      touched: false,
      isFullscreen: false,
      fullscreenTarget: null,
      mouseEntered: false,
      controlsMouseEntered: false,
      dragging: false,
      seekedTime: 0,
      seekedPercentage: 0,
      scrubbedPercentage: 0,
      thumbPercentage: 0,
      popoverOffsetX: 0,
      controlsBarRect: undefined,
      controlsTrackRect: undefined,
      controlsPopoverRect: undefined,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    playerStateStore.value = [...playerStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState() {
    let state = playerStateStore.value.find((entry) => {
      return entry.id === id
    })

    if (!state) state = addState(toValue(id))
    return state
  }

  function deleteState() {
    playerStateStore.value = playerStateStore.value.filter((x) => x.id !== id)
  }

  return {
    initializeState,
    deleteState,
    playerStateStore,
  }
}
