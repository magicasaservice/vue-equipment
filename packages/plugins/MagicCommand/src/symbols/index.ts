import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicCommandOptions } from '../types'

const MagicCommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

const MagicCommandViewId = Symbol() as InjectionKey<string>
const MagicCommandViewActive = Symbol() as InjectionKey<boolean>

const MagicCommandContentId = Symbol() as InjectionKey<string>

const MagicCommandItemId = Symbol() as InjectionKey<string>
const MagicCommandItemActive = Symbol() as InjectionKey<boolean>

const MagicCommandProviderOptions =
  Symbol() as InjectionKey<MagicCommandOptions>

export {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandViewActive,
  MagicCommandContentId,
  MagicCommandItemId,
  MagicCommandItemActive,
  MagicCommandProviderOptions,
}
