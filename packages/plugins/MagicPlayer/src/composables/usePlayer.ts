import type { MaybeRef } from '@vueuse/core'
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
  type SourceType,
} from './../types'

type UsePlayerArgs = {
  playerRef: MaybeRef<HTMLElement | undefined>
  videoRef: MaybeRef<HTMLVideoElement | undefined>
  srcType: SourceType
  src: string
}

type UsePlayerReturn = {
  playerApi: UsePlayerApiReturn
  mediaApi: UseMediaApiReturn
  runtimeProvider: UseRuntimeSourceProviderReturn
}

export function useProvidePlayer(args: UsePlayerArgs): UsePlayerReturn {
  const mediaApi = useMediaApi(args.videoRef)
  provide(MediaApiInjectionKey, mediaApi)

  const playerApi = usePlayerApi(args.playerRef, args.videoRef, mediaApi)
  provide(PlayerApiInjectionKey, playerApi)

  const runtimeProvider = useRuntimeSourceProvider(
    args.videoRef,
    args.srcType,
    args.src
  )
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
