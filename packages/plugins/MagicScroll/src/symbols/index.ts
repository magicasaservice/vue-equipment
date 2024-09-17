import type { InjectionKey, Ref, MaybeRef } from 'vue'
import type { UseScrollReturn } from '@vueuse/core'

const MagicScrollParent = Symbol() as InjectionKey<
  MaybeRef<HTMLElement | undefined>
>
const MagicScrollProgress = Symbol() as InjectionKey<Ref<number>>
const MagicScrollReturn = Symbol() as InjectionKey<UseScrollReturn | undefined>

export { MagicScrollParent, MagicScrollProgress, MagicScrollReturn }
