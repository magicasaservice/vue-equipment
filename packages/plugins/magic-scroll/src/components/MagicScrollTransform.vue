<template>
  <component :is="as" :style="computedStyle" v-bind="$attrs">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  as?: string
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  translateX?: number
  translateY?: number
}

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  as = 'div',
  scale = 1,
  scaleX = 1,
  scaleY = 1,
  skewX = 0,
  skewY = 0,
  translateX = 0,
  translateY = 0,
} = defineProps<Props>()

const computedStyle = computed(() => {
  return {
    willChange: 'transform',
    transform: `matrix(${scale || scaleX}, ${skewY}, ${skewX},  ${
      scale || scaleY
    }, ${translateX}, ${translateY})`,
  }
})
</script>
