import type { InjectionKey, Ref, MaybeRef } from 'vue'
import type { UseScrollReturn } from '@vueuse/core'

const MagicScrollTarget = Symbol() as InjectionKey<
  MaybeRef<HTMLElement | null | undefined>
>
const MagicScrollProgress = Symbol() as InjectionKey<Ref<number>>
const MagicScrollReturn = Symbol() as InjectionKey<UseScrollReturn | undefined>

export { MagicScrollTarget, MagicScrollProgress, MagicScrollReturn }
