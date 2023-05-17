import type { InjectionKey, ComputedRef, Ref } from 'vue'

const WindowDimensionsKey = Symbol('windowDimensions') as InjectionKey<{
  vw: Ref<number>
  vh: Ref<number>
}>

const WindowScrollKey = Symbol('windowScroll') as InjectionKey<{
  x: number
  y: number
}>

const ScrollProgressKey = Symbol('scrollProgress') as InjectionKey<
  ComputedRef<number>
>

export { WindowDimensionsKey, WindowScrollKey, ScrollProgressKey }
