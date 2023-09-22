import type { InjectionKey } from 'vue'
import type { UseMediaApiReturn } from '../composables/useMediaApi'
import type { UsePlayerApiReturn } from '../composables/usePlayerApi'
import type { UseRuntimeSourceProviderReturn } from '../composables/useRuntimeSourceProvider'
import type { UseControlsApiReturn } from '../composables/useControlsApi'

const MediaApiInjectionKey = Symbol() as InjectionKey<UseMediaApiReturn>
const PlayerApiInjectionKey = Symbol() as InjectionKey<UsePlayerApiReturn>
const RuntimeSourceProviderInjectionKey =
  Symbol() as InjectionKey<UseRuntimeSourceProviderReturn>
const ControlsApiInjectionKey = Symbol() as InjectionKey<UseControlsApiReturn>

export {
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
  RuntimeSourceProviderInjectionKey,
  ControlsApiInjectionKey,
}
