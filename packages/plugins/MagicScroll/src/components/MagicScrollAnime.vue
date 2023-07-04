<template>
  <div ref="targetRef" class="magic-scroll-anime">
    <slot />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import anime from 'animejs'
import { ref, inject, computed, onMounted, watch } from 'vue'
import { toValue } from '@vueuse/shared'
import { ScrollProgressKey } from '../types'

// @ts-ignore
import type { AnimeInstance } from 'animejs'

interface Props {
  keyframes: Record<string, any>[]
}

const { keyframes = [] } = defineProps<Props>()
const animation = ref<AnimeInstance>()
const duration = ref(0)
const targetRef = ref<HTMLElement | undefined>(undefined)

const progress = inject(
  ScrollProgressKey,
  computed(() => 0)
)

onMounted(() => {
  animation.value = anime({
    targets: toValue(targetRef.value),
    autoplay: false,
    easing: 'linear',
    keyframes,
  })

  duration.value = animation.value.duration
})

watch(progress, (value) => {
  animation.value?.seek(value * duration.value)
})
</script>
