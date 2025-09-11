import type { InjectionKey, MaybeRef } from 'vue'

const MagicToastInstanceId = Symbol() as InjectionKey<MaybeRef<string>>

export { MagicToastInstanceId }
