import type { InjectionKey } from 'vue'
import type { UseMediaApiReturn } from '../composables/useMediaApi'
import type { UsePlayerApiReturn } from '../composables/usePlayerApi'

const MediaApiInjectionKey = Symbol() as InjectionKey<UseMediaApiReturn>
export { MediaApiInjectionKey }

const PlayerApiInjectionKey = Symbol() as InjectionKey<UsePlayerApiReturn>
export { PlayerApiInjectionKey }
