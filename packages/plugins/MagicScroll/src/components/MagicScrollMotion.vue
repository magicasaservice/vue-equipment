<template>
  <div ref="elRef" class="magic-scroll-motion">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, watch } from 'vue'
import { unrefElement } from '@vueuse/core'
import {
  animate,
  type MotionKeyframesDefinition,
  type AnimationControls,
  type Easing,
} from 'motion'
import { ScrollProgressKey } from '../symbols'

interface Props {
  keyframes: MotionKeyframesDefinition
  offset?: number[] | undefined
  easing?: Easing
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  easing: 'linear',
})

const animation = ref<AnimationControls | undefined>(undefined)
const elRef = ref<HTMLElement | undefined>(undefined)

const progress = inject(
  ScrollProgressKey,
  computed(() => 0)
)

const mappedProgress = computed(() => {
  return props.progress || progress.value
})

function createAnimation(currentTime: number = 0) {
  if (!props.keyframes) return
  animation.value = animate(unrefElement(elRef)!, props.keyframes, {
    duration: 1,
    easing: props.easing || 'linear',
    offset: props.offset,
  })
  animation.value.stop()
  animation.value.currentTime = currentTime
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
    if (mappedProgress.value) {
      createAnimation(mappedProgress.value)
    } else {
      createAnimation()
    }
  }
)
</script>
