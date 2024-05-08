import type { InjectionKey, MaybeRef } from 'vue'
import type { CommandOptions } from '../types'

const MagicCommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCommandOptions = Symbol() as InjectionKey<CommandOptions>

export { MagicCommandInstanceId, MagicCommandOptions }
