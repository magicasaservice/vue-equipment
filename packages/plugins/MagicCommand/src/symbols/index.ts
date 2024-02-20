import type { InjectionKey, MaybeRef } from 'vue'

const CommandInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

export { CommandInstanceId }
