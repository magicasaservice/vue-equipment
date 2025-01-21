<template>
  <component :is="as" :style="computedStyle" v-bind="$attrs">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface MagicScrollTransformProps {
  as?: string
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  translateX?: number
  translateY?: number
}

const props = withDefaults(defineProps<MagicScrollTransformProps>(), {
  as: 'div',
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  translateX: 0,
  translateY: 0,
})

const computedStyle = computed(() => {
  return {
    willChange: 'transform',
    transform: `matrix(${props.scale || props.scaleX}, ${props.skewY}, ${
      props.skewX
    },  ${props.scale || props.scaleY}, ${props.translateX}, ${
      props.translateY
    })`,
  }
})
</script>
