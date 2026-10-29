import type { InjectionKey, MaybeRef } from 'vue'

const MagicCarouselInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

export { MagicCarouselInstanceId }
