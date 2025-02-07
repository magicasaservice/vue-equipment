import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicPlayerOptions } from '../types'

const MagicPlayerInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicPlayerOptionsKey = Symbol() as InjectionKey<MagicPlayerOptions>

export { MagicPlayerInstanceId, MagicPlayerOptionsKey }
