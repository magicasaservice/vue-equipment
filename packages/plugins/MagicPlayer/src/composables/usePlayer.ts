import { provide, inject } from 'vue'
import { useMediaApi, type UseMediaApiReturn } from './useMediaApi'
import { usePlayerApi, type UsePlayerApiReturn } from './usePlayerApi'
import {
  useRuntimeSourceProvider,
  type UseRuntimeSourceProviderReturn,
} from './useRuntimeSourceProvider'
import {
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
  RuntimeSourceProviderInjectionKey,
  type UsePlayerArgs,
} from './../types'

type UsePlayerReturn = {
  playerApi: UsePlayerApiReturn
  mediaApi: UseMediaApiReturn
  runtimeProvider: UseRuntimeSourceProviderReturn
}

export function useProvidePlayer(args: UsePlayerArgs): UsePlayerReturn {
  const mediaApi = useMediaApi(args.videoRef)
  provide(MediaApiInjectionKey, mediaApi)

  const playerApi = usePlayerApi({ ...args, mediaApi })
  provide(PlayerApiInjectionKey, playerApi)

  const runtimeProvider = useRuntimeSourceProvider(args)
  provide(RuntimeSourceProviderInjectionKey, runtimeProvider)

  return {
    playerApi,
    mediaApi,
    runtimeProvider,
  }
}

export function useInjectPlayer(): UsePlayerReturn {
  return {
    playerApi: inject(PlayerApiInjectionKey) as UsePlayerApiReturn,
    mediaApi: inject(MediaApiInjectionKey) as UseMediaApiReturn,
    runtimeProvider: inject(
      RuntimeSourceProviderInjectionKey
    ) as UseRuntimeSourceProviderReturn,
  }
}
