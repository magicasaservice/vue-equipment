import type { InjectionKey, MaybeRef } from 'vue'

const MagicTrayInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

export { MagicTrayInstanceId }
