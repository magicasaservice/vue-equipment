import type { InjectionKey } from 'vue'
import type { UseMediaApiReturn } from './../composables/useMediaApi'

const mediaApiInjectionKey = Symbol() as InjectionKey<UseMediaApiReturn>
export { mediaApiInjectionKey }
