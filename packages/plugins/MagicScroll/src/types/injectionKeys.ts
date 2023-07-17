import type { magicScrollStore } from '../store'
import type { InjectionKey, Ref } from 'vue'
import type { WindowDimensions } from './index'

const WindowDimensionsKey = Symbol() as InjectionKey<WindowDimensions>

const WindowScrollKey = Symbol() as InjectionKey<{
  x: number
  y: number
}>

const ScrollProgressKey = Symbol() as InjectionKey<Ref<number>>

const StoreKey = Symbol() as InjectionKey<typeof magicScrollStore>

export { WindowDimensionsKey, WindowScrollKey, ScrollProgressKey, StoreKey }
