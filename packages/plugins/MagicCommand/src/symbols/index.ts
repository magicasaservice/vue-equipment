import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicCommandOptions } from '../types'

const MagicCommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCommandParentTree = Symbol() as InjectionKey<string[]>

const MagicCommandViewId = Symbol() as InjectionKey<string>
const MagicCommandViewActive = Symbol() as InjectionKey<MaybeRef<boolean>>

const MagicCommandContentId = Symbol() as InjectionKey<string>

const MagicCommandItemId = Symbol() as InjectionKey<string>
const MagicCommandItemActive = Symbol() as InjectionKey<MaybeRef<boolean>>
const MagicCommandItemDisabled = Symbol() as InjectionKey<MaybeRef<boolean>>

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
