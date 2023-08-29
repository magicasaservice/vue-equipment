import { type MaybeRef } from 'vue'

type SourceType = 'native' | 'hls'

type UseControlsArgs = {
  barRef?: MaybeRef<HTMLDivElement | undefined>
  trackRef: MaybeRef<HTMLDivElement | undefined>
  popoverRef?: MaybeRef<HTMLDivElement | undefined>
}

type UsePlayerArgs = {
  playerRef: MaybeRef<HTMLElement | undefined>
  videoRef: MaybeRef<HTMLVideoElement | undefined>
  srcType: SourceType
  src: string
}

export * from './injectionKeys'
export type { SourceType, UseControlsArgs, UsePlayerArgs }
