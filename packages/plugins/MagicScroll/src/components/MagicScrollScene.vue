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
  onMounted,
  watch,
  nextTick,
  toRaw,
  readonly,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { mapValue } from '../utils'
import { useProgress } from '../composables/useProgress'
import { ScrollPositionKey, ScrollParentKey, ScrollProgressKey } from '../types'

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

const scrollPosition = inject(ScrollPositionKey, undefined)
const scrollParent = inject(ScrollParentKey)

const sceneRef = ref<HTMLElement | undefined>(undefined)
const progress = ref(0)

const { getCalculations, getProgress } = useProgress({
  child: sceneRef,
  parent: scrollParent,
  from: props.from,
  to: props.to,
})

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
  () => scrollPosition?.y.value,
  () => {
    if (intersecting.value) {
      calculate()
    }
  },
)

const intersecting = ref()

useIntersectionObserver(
  toRaw(sceneRef),
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
  },
  { rootMargin: '150% 0px 150% 0px' },
)

provide('mapValue', mapValue)
provide(ScrollProgressKey, readonly(progress))
</script>
