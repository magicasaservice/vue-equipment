import { toRefs, type MaybeRef } from 'vue'
import { usePlayerVideoApi } from './private/usePlayerVideoApi'
import { usePlayerAudioApi } from './private/usePlayerAudioApi'
import { usePlayerRuntime } from './private/usePlayerRuntime'
import { usePlayerControlsApi } from './private/usePlayerControlsApi'
import { usePlayerState } from './private/usePlayerState'
import { usePlayerPlaylistApi } from './private/usePlayerPlaylistApi'

export function useMagicPlayer(id: MaybeRef<string>) {
  const audioApi = usePlayerAudioApi({ id })
  const videoApi = usePlayerVideoApi({ id })
  const controlsApi = usePlayerControlsApi({ id })
  const playerRuntime = usePlayerRuntime({ id })
  const { next, prev, goTo } = usePlayerPlaylistApi({ id })

  const { initializeState } = usePlayerState(id)
  const state = initializeState()
  const {
    currentTime,
    duration,
    seeking,
    volume,
    rate,
    loaded,
    waiting,
    ended,
    playing,
    started,
    paused,
    stalled,
    buffered,
    muted,
    touched,
    dragging,
    fullscreen,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
    playlistIndex,
    playlistCount,
    skipping,
  } = toRefs(state)

  return {
    duration,
    seeking,
    volume,
    rate,
    loaded,
    waiting,
    ended,
    playing,
    started,
    paused,
    stalled,
    buffered,
    muted,
    touched,
    dragging,
    fullscreen,
    currentTime,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
    playlistIndex,
    playlistCount,
    skipping,
    next,
    prev,
    goTo,
    audioApi,
    videoApi,
    controlsApi,
    playerRuntime,
  }
}

export type UseMagicPlayerReturn = ReturnType<typeof useMagicPlayer>
