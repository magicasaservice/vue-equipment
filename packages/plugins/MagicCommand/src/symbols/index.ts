import type { InjectionKey, MaybeRef } from 'vue'
import type { CommandOptions } from '../types'

const CommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const CommandOptionsKey = Symbol() as InjectionKey<CommandOptions>

export { CommandInstanceId, CommandOptionsKey }
