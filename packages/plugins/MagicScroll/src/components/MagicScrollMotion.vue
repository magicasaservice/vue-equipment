<template>
  <div ref="elRef" class="magic-scroll-motion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, watch } from 'vue'
import { unrefElement } from '@vueuse/core'
import {
  animate,
  type MotionKeyframesDefinition,
  type AnimationControls,
  type Easing,
} from 'motion'
import { MagicScrollProgress } from '../symbols'

interface MagicScrollMotionProps {
  keyframes?: MotionKeyframesDefinition
  offset?: number[]
  easing?: Easing
  progress?: number
}

const props = withDefaults(defineProps<MagicScrollMotionProps>(), {
  easing: 'linear',
})

const animation = ref<AnimationControls | undefined>(undefined)
const elRef = ref<HTMLElement | undefined>(undefined)

const injectedProgress = inject(
  MagicScrollProgress,
  computed(() => 0)
)

const mappedProgress = computed(() => {
  return props.progress || injectedProgress.value || 0
})

function createAnimation() {
  if (!props.keyframes) return
  animation.value = animate(unrefElement(elRef)!, props.keyframes, {
    duration: 1,
    easing: props.easing || 'linear',
    offset: props.offset,
  })
  animation.value.stop()
  animation.value.currentTime = mappedProgress.value
}

onMounted(() => {
  createAnimation()
})

watch(mappedProgress, (value) => {
  if ((!value && value !== 0) || !animation.value || !props.keyframes) return
  animation.value.currentTime = value
})

watch(
  () => props.keyframes,
  () => {
    createAnimation()
  }
)
</script>
