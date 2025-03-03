import type { InjectionKey, MaybeRef, Ref } from 'vue'

const MagicAccordionInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

const MagicAccordionViewId = Symbol() as InjectionKey<string>
const MagicAccordionViewActive = Symbol() as InjectionKey<Ref<boolean>>

export {
  MagicAccordionInstanceId,
  MagicAccordionViewId,
  MagicAccordionViewActive,
}
