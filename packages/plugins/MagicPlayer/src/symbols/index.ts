import type { InjectionKey, MaybeRef } from 'vue'

const MagicPlayerInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

export { MagicPlayerInstanceId }
