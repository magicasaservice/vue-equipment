<template>
  <div ref="el" class="magic-scroll-anime">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, toRaw, watch } from 'vue'
import { AnimeInstance } from 'animejs'
import anime from 'animejs/lib/anime.es.js'
import { ScrollProgressKey } from '../types'

interface Props {
  keyframes: Record<string, any>[]
}

const { keyframes = [] } = defineProps<Props>()
const animation = ref<AnimeInstance>()
const duration = ref(0)
const el = ref()

const progress = inject(
  ScrollProgressKey,
  computed(() => 0)
)

onMounted(() => {
  animation.value = anime({
    targets: toRaw(el.value),
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
