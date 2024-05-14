import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicCommandOptions as MagicCommandOptions } from '../types'

const MagicCommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCommandProviderOptions =
  Symbol() as InjectionKey<MagicCommandOptions>

export { MagicCommandInstanceId, MagicCommandProviderOptions }
