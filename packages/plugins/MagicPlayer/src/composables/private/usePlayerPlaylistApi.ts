import { toValue } from 'vue'
import { usePlayerState } from './usePlayerState'

import type { MaybeRef } from 'vue'

export type UsePlayerPlaylistApiArgs = {
  id: MaybeRef<string>
}

export function usePlayerPlaylistApi(args: UsePlayerPlaylistApiArgs) {
  const { id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()

  function next() {
    if (state.playlistIndex < state.playlistCount - 1) {
      state.playlistIndex++
    } else if (state.loop) {
      state.playlistIndex = 0
    }
  }

  function prev() {
    if (state.playlistIndex > 0) {
      state.playlistIndex--
    } else if (state.loop) {
      state.playlistIndex = state.playlistCount - 1
    }
  }

  function goTo(index: number) {
    if (index >= 0 && index < state.playlistCount) {
      state.playlistIndex = index
    }
  }

  return { next, prev, goTo }
}

export type UsePlayerPlaylistApiReturn = ReturnType<typeof usePlayerPlaylistApi>
