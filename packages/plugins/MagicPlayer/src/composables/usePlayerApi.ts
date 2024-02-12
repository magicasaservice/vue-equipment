import type { MaybeRef } from '@vueuse/core'
import { usePlayerMediaApi } from './private/usePlayerMediaApi'
import { usePlayerVideoApi } from './private/usePlayerVideoApi'
import { usePlayerRuntime } from './private/usePlayerRuntime'
import { usePlayerControlsApi } from './private/usePlayerControlsApi'

type usePlayerApiArgs = {
  id: MaybeRef<string>
}

export function usePlayerApi(args: usePlayerApiArgs) {
  const mediaApi = usePlayerMediaApi({ id: args.id })
  const videoApi = usePlayerVideoApi({ id: args.id })
  const controlsApi = usePlayerControlsApi({ id: args.id })
  const playerRuntime = usePlayerRuntime({ id: args.id })

  return {
    mediaApi,
    videoApi,
    controlsApi,
    playerRuntime,
  }
}

export type UsePlayerApiApiReturn = ReturnType<typeof usePlayerApi>
