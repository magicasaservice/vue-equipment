import { toRefs, type MaybeRef } from 'vue'
import { usePlayerVideoApi } from './private/usePlayerVideoApi'
import { usePlayerAudioApi } from './private/usePlayerAudioApi'
import { usePlayerRuntime } from './private/usePlayerRuntime'
import { usePlayerControlsApi } from './private/usePlayerControlsApi'
import { usePlayerState } from './private/usePlayerState'

export function useMagicPlayer(id: MaybeRef<string>) {
  const audioApi = usePlayerAudioApi({ id })
  const videoApi = usePlayerVideoApi({ id })
  const controlsApi = usePlayerControlsApi({ id })
  const playerRuntime = usePlayerRuntime({ id })

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
    isFullscreen,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
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
    isFullscreen,
    currentTime,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    thumbPercentage,
    popoverOffsetX,
    audioApi,
    videoApi,
    controlsApi,
    playerRuntime,
  }
}

export type UseMagicPlayerReturn = ReturnType<typeof useMagicPlayer>
