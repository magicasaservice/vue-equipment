import { type MaybeRef } from 'vue'

type SourceType = 'native' | 'hls'

type UseMediaApiArgs = {
  mediaRef: MaybeRef<HTMLMediaElement | undefined>
}

type UseControlsApiArgs = {
  id: MaybeRef<string>
  barRef?: MaybeRef<HTMLDivElement | undefined>
  trackRef: MaybeRef<HTMLDivElement | undefined>
  popoverRef?: MaybeRef<HTMLDivElement | undefined>
}

type UsePlayerInternalApiArgs = {
  id: MaybeRef<string>
  playerRef: MaybeRef<HTMLElement | undefined>
  videoRef: MaybeRef<HTMLVideoElement | undefined>
}

type UseRuntimeSourceProviderArgs = {
  videoRef: MaybeRef<HTMLVideoElement | undefined>
  srcType: SourceType
  src: string
}

type UsePlayerApiArgs = Partial<
  UseMediaApiArgs &
    UseControlsApiArgs &
    UsePlayerInternalApiArgs &
    UseRuntimeSourceProviderArgs
> & {
  id: MaybeRef<string>
}

export type {
  SourceType,
  UseMediaApiArgs,
  UsePlayerApiArgs,
  UseControlsApiArgs,
  UsePlayerInternalApiArgs,
  UseRuntimeSourceProviderArgs,
}
