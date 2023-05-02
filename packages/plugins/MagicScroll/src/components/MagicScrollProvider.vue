<template>
  <div ref="el" class="magic-scroll-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
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

provide(WindowScrollKey, reactive(scrollPosition))
provide(WindowDimensionsKey, { vw: width, vh: height })
</script>
