import type { InjectionKey, MaybeRef } from 'vue'

export interface ModalActive {
  innerActive: boolean
  wrapperActive: boolean
}

const MagicModalInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicModalActiveKey = Symbol() as InjectionKey<ModalActive>

export { MagicModalInstanceId, MagicModalActiveKey }
