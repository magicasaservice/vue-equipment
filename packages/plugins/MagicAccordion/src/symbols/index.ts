import type { InjectionKey, MaybeRef } from 'vue'

const MagicAccordionInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

const MagicAccordionViewId = Symbol() as InjectionKey<string>
const MagicAccordionViewActive = Symbol() as InjectionKey<MaybeRef<boolean>>

export {
  MagicAccordionInstanceId,
  MagicAccordionViewId,
  MagicAccordionViewActive,
}
