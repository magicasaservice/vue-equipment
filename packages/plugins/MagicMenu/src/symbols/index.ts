import type { InjectionKey, MaybeRef } from 'vue'

const MagicMenuInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicMenuParentTree = Symbol() as InjectionKey<string[]>

const MagicMenuViewId = Symbol() as InjectionKey<string>
const MagicMenuViewActive = Symbol() as InjectionKey<boolean>

const MagicMenuContentId = Symbol() as InjectionKey<string>

const MagicMenuItemId = Symbol() as InjectionKey<string>
const MagicMenuItemActive = Symbol() as InjectionKey<boolean>

export {
  MagicMenuInstanceId,
  MagicMenuParentTree,
  MagicMenuViewId,
  MagicMenuViewActive,
  MagicMenuContentId,
  MagicMenuItemId,
  MagicMenuItemActive,
}
