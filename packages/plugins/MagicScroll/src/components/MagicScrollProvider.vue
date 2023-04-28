<template>
  <div ref="el" class="magic-scroll-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, reactive } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { WindowScrollKey, WindowDimensionsKey } from '../types'

interface Props {
  hasScrollListener?: Boolean
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { hasScrollListener = true } = defineProps<Props>()
const el = ref()

const scrollPosition = hasScrollListener ? useWindowScroll() : { x: 0, y: 0 }
const { width, height } = useWindowSize()

provide(WindowScrollKey, reactive(scrollPosition))
provide('pageYOffset', scrollPosition)
provide(WindowDimensionsKey, { vw: width, vh: height })
provide('viewport', { vw: width, vh: height })
</script>
