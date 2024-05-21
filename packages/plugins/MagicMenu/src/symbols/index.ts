import type { InjectionKey, MaybeRef, Ref } from 'vue'

const MagicMenuInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicMenuParentTree = Symbol() as InjectionKey<string[]>

const MagicMenuViewId = Symbol() as InjectionKey<string>
const MagicMenuViewActive = Symbol() as InjectionKey<string[]>

const MagicMenuItemId = Symbol() as InjectionKey<string>
const MagicMenuItemActive = Symbol() as InjectionKey<Ref<boolean>>

export {
  MagicMenuInstanceId,
  MagicMenuParentTree,
  MagicMenuViewId,
  MagicMenuViewActive,
  MagicMenuItemId,
  MagicMenuItemActive,
}
