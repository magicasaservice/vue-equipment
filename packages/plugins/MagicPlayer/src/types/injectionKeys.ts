import type { InjectionKey } from 'vue'
import type { UseMediaApiReturn } from '../composables/useMediaApi'
import type { UsePlayerApiReturn } from '../composables/usePlayerApi'
import type { UseRuntimeSourceProviderReturn } from '../composables/useRuntimeSourceProvider'

const MediaApiInjectionKey = Symbol() as InjectionKey<UseMediaApiReturn>
const PlayerApiInjectionKey = Symbol() as InjectionKey<UsePlayerApiReturn>
const RuntimeSourceProviderInjectionKey =
  Symbol() as InjectionKey<UseRuntimeSourceProviderReturn>

export {
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
  RuntimeSourceProviderInjectionKey,
}
