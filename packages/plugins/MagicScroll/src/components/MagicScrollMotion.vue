<template>
  <div ref="el" class="m-scroll-motion">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, toRaw, watch } from 'vue'
import { animate, type Easing } from 'motion'
import { ScrollProgressKey } from '../types'

interface Props {
  keyframes: Record<string, any> | null | undefined
  offset?: number[] | undefined
  easing?: Easing
}

const props = withDefaults(defineProps<Props>(), {
  keyframes: undefined,
  offset: undefined,
  easing: 'linear',
})

const animation = ref()
const el = ref()

const progress = inject(
  ScrollProgressKey,
  computed(() => 0),
)

function createAnimation(currentTime: number = 0) {
  if (!props.keyframes) return
  animation.value = animate(toRaw(el.value), props.keyframes, {
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

watch(progress, (value) => {
  if (!animation.value || !props.keyframes) return
  animation.value.currentTime = value
})

watch(
  () => props.keyframes,
  () => {
    createAnimation(progress.value)
  },
)
</script>