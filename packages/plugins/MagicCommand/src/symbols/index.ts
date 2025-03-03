import type { InjectionKey, MaybeRef, Ref } from 'vue'
import type { MagicCommandOptions } from '../types'

const MagicCommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCommandParentTree = Symbol() as InjectionKey<string[]>

const MagicCommandViewId = Symbol() as InjectionKey<string>
const MagicCommandViewActive = Symbol() as InjectionKey<Ref<boolean>>

const MagicCommandContentId = Symbol() as InjectionKey<string>

const MagicCommandItemId = Symbol() as InjectionKey<string>
const MagicCommandItemActive = Symbol() as InjectionKey<Ref<boolean>>
const MagicCommandItemDisabled = Symbol() as InjectionKey<Ref<boolean>>

const MagicCommandProviderOptions =
  Symbol() as InjectionKey<MagicCommandOptions>

export {
  MagicCommandInstanceId,
  MagicCommandParentTree,
  MagicCommandViewId,
  MagicCommandViewActive,
  MagicCommandContentId,
  MagicCommandItemId,
  MagicCommandItemActive,
  MagicCommandItemDisabled,
  MagicCommandProviderOptions,
}
