import type { InjectionKey, MaybeRef } from 'vue'
import type { DrawerActive } from '../types'

const MagicDrawerInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicDrawerActiveKey = Symbol() as InjectionKey<DrawerActive>

export { MagicDrawerInstanceId, MagicDrawerActiveKey }
