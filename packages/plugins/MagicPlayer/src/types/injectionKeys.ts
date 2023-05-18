import type { InjectionKey } from 'vue'
import type { UseMediaApiReturn } from '../composables/useMediaApi'

const MediaApiInjectionKey = Symbol() as InjectionKey<UseMediaApiReturn>
export { MediaApiInjectionKey }
