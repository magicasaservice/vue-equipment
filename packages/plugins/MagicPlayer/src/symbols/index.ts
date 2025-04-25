import type { InjectionKey, MaybeRef, Ref } from 'vue'
import type { MagicPlayerOptions } from '../types'

const MagicPlayerInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicPlayerOptionsKey = Symbol() as InjectionKey<MagicPlayerOptions>
const MagicPlayerRef = Symbol() as InjectionKey<Ref<HTMLDivElement | null>>

const MagicPlayerTrackRef = Symbol() as InjectionKey<Ref<HTMLDivElement | null>>
const MagicPlayerBarRef = Symbol() as InjectionKey<Ref<HTMLDivElement | null>>
const MagicPlayerPopoverRef = Symbol() as InjectionKey<
  Ref<HTMLDivElement | null>
>

export {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerRef,
  MagicPlayerTrackRef,
  MagicPlayerBarRef,
  MagicPlayerPopoverRef,
}
