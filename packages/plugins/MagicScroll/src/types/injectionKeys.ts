import type { InjectionKey, Ref } from 'vue'
import type { WindowDimensions } from './index'

const WindowDimensionsKey = Symbol(
  'windowDimensions'
) as InjectionKey<WindowDimensions>

const WindowScrollKey = Symbol('windowScroll') as InjectionKey<{
  x: number
  y: number
}>

const ScrollProgressKey = Symbol('scrollProgress') as InjectionKey<Ref<number>>

export { WindowDimensionsKey, WindowScrollKey, ScrollProgressKey }
