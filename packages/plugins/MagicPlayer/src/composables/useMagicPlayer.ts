import { usePlayerMediaApi } from './private/usePlayerMediaApi'
import { usePlayerVideoApi } from './private/usePlayerVideoApi'
import { usePlayerRuntime } from './private/usePlayerRuntime'
import { usePlayerControlsApi } from './private/usePlayerControlsApi'

import type { MaybeRef } from 'vue'

export function useMagicPlayer(id: MaybeRef<string>) {
  const mediaApi = usePlayerMediaApi({ id })
  const videoApi = usePlayerVideoApi({ id })
  const controlsApi = usePlayerControlsApi({ id })
  const playerRuntime = usePlayerRuntime({ id })

  return {
    mediaApi,
    videoApi,
    controlsApi,
    playerRuntime,
  }
}

export type UseMagicPlayerReturn = ReturnType<typeof useMagicPlayer>
