import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { createStateStore } from '@maas/vue-equipment/utils'
import type { PlayerState } from '../../types/index'

const getPlayerStateStore = createStateStore<PlayerState[]>(
  'MagicPlayer',
  () => []
)

export function usePlayerState(id: MaybeRef<string>) {
  const playerStateStore = getPlayerStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: PlayerState = {
      id: id,
      refCount: 0,
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
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    playerStateStore.value = [...playerStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(id)
    playerStateStore.value = playerStateStore.value.filter(
      (x) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState() {
    const currentId = toValue(id)
    let state = playerStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(id)
    const state = playerStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    playerStateStore,
  }
}
