<template>
  <div ref="el" class="magic-scroll-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, readonly } from 'vue'
import { useWindowScroll, useWindowSize, toValue } from '@vueuse/core'
import { WindowScrollKey, WindowDimensionsKey } from '../types'

interface Props {
  hasScrollListener?: Boolean
}
const props = withDefaults(defineProps<Props>(), {
  hasScrollListener: () => true,
})

const el = ref()

const scrollPosition = props.hasScrollListener
  ? useWindowScroll()
  : { x: 0, y: 0 }
const { width, height } = useWindowSize()

const windowscrollDefault = reactive(scrollPosition)
const windowDimensionsDefault = reactive({
  vw: toValue(width),
  vh: toValue(height),
})

provide(WindowScrollKey, readonly(windowscrollDefault))
provide(WindowDimensionsKey, readonly(windowDimensionsDefault))
</script>
