<template>
  <div ref="sceneRef" class="magic-scroll-scene">
    <slot :map-value="mapValue" :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  provide,
  inject,
  computed,
  onMounted,
  watch,
  nextTick,
  toRaw,
  readonly,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { mapValue } from '../utils'
import { useProgress } from '../composables/useProgress'
import { WindowScrollKey, ScrollProgressKey } from '../types'

import type { FromTo } from '../types'

interface Props {
  from?: FromTo
  to?: FromTo
  debug?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  from: 'top-bottom',
  to: 'bottom-top',
})

const scrollPosition = inject(WindowScrollKey, { x: 0, y: 0 })
const pageYOffset = computed(() => scrollPosition.y)

const sceneRef = ref<HTMLElement | undefined>(undefined)
const progress = ref(0)

const { getCalculations, getProgress } = useProgress(
  sceneRef,
  props.from,
  props.to
)

const calculate = () => {
  getCalculations()
  nextTick(() => {
    progress.value = getProgress()
  })
}

onMounted(() => {
  calculate()
})

watch(
  () => pageYOffset.value,
  () => {
    if (intersecting.value) {
      calculate()
    }
  }
)

const intersecting = ref()

useIntersectionObserver(
  toRaw(sceneRef),
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
  },
  { rootMargin: '150% 0px 150% 0px' }
)

provide('mapValue', readonly(mapValue))
provide(ScrollProgressKey, readonly(progress))
</script>
