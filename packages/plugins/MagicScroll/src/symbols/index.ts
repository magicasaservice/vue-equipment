import type { InjectionKey, Ref, MaybeRefOrGetter } from 'vue'
import type { UseScrollReturn } from '@vueuse/core'

const ScrollParentKey = Symbol() as InjectionKey<
  MaybeRefOrGetter<HTMLElement | undefined>
>

const ScrollPositionKey = Symbol() as InjectionKey<UseScrollReturn | undefined>

const ScrollProgressKey = Symbol() as InjectionKey<Ref<number>>

export { ScrollParentKey, ScrollPositionKey, ScrollProgressKey }
