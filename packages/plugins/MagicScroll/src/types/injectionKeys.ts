import type { magicScrollEmit } from '../utils'
import type { magicScrollStore } from '../store'
import type { UseProgressReturn } from '../composables/useProgress'
import type { UseCollisionDetectReturn } from '../composables/useCollisionDetect'
import type { InjectionKey, Ref } from 'vue'
import type { WindowDimensions } from './index'

const WindowDimensionsKey = Symbol() as InjectionKey<WindowDimensions>

const WindowScrollKey = Symbol() as InjectionKey<{
  x: number
  y: number
}>

const ScrollProgressKey = Symbol() as InjectionKey<Ref<number>>

const EmitKey = Symbol() as InjectionKey<typeof magicScrollEmit>

const StoreKey = Symbol() as InjectionKey<typeof magicScrollStore>

const UseProgressKey = Symbol() as InjectionKey<UseProgressReturn>

const UseCollisionDetectKey = Symbol() as InjectionKey<UseCollisionDetectReturn>

export {
  WindowDimensionsKey,
  WindowScrollKey,
  ScrollProgressKey,
  EmitKey,
  StoreKey,
  UseProgressKey,
  UseCollisionDetectKey,
}
