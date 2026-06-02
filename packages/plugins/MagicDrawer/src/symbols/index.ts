import type { InjectionKey, MaybeRef } from 'vue'

const MagicDrawerInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicDrawerActiveKey = Symbol() as InjectionKey<{
  innerActive: boolean
  wrapperActive: boolean
}>

export { MagicDrawerInstanceId, MagicDrawerActiveKey }
