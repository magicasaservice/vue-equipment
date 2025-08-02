import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import type { PlayerState } from '../../types/index'

const playerStateStore: Ref<PlayerState[]> = ref([])

export function usePlayerState(id: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: PlayerState = {
      id: id,
      buffered: [],
      currentTime: 0,
      dragging: false,
      duration: 0,
      ended: false,
      fullscreen: false,
      loaded: false,
      muted: false,
      paused: false,
      playing: false,
      rate: 1,
      seeking: false,
      stalled: false,
      started: false,
      touched: false,
      volume: 1,
      waiting: false,
      fullscreenTarget: null,
      mouseEntered: false,
      controlsMouseEntered: false,
      seekedTime: null,
      seekedPercentage: 0,
      scrubbedPercentage: 0,
      thumbPercentage: 0,
      popoverOffsetX: null,
      hasOverlay: false,
      hasControls: false,
      controlsBarRect: undefined,
      controlsTrackRect: undefined,
      controlsPopoverRect: undefined,
      errors: [],
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
