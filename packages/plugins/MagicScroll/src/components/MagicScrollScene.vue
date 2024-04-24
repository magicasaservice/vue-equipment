<template>
  <div ref="elRef" class="magic-scroll-scene">
    <slot :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, onMounted, watch, nextTick, readonly } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useScrollApi } from '../composables/useScrollApi'
import {
  ScrollPositionKey,
  ScrollParentKey,
  ScrollProgressKey,
} from '../symbols'

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

const elRef = ref<HTMLElement | undefined>(undefined)
const progress = ref(0)
const intersecting = ref()

const { getCalculations, getProgress } = useScrollApi({
  child: elRef,
  parent: scrollParent,
  from: props.from,
  to: props.to,
})

async function calculate() {
  getCalculations()
  await nextTick()
  progress.value = getProgress()
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
  }
)

useIntersectionObserver(
  elRef,
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
    if (isIntersecting) {
      calculate()
    }
  },
  { rootMargin: '150% 0px 150% 0px', threshold: 0.01, immediate: true }
)

provide(ScrollProgressKey, readonly(progress))
</script>
