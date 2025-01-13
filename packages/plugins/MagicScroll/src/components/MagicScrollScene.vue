<template>
  <div ref="elRef" class="magic-scroll-scene">
    <slot :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, watch, nextTick, readonly } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useScrollApi } from '../composables/private/useScrollApi'
import {
  MagicScrollParent,
  MagicScrollProgress,
  MagicScrollReturn,
} from '../symbols'

import type { FromTo } from '../types'

interface MagicScrollSceneProps {
  from?: FromTo
  to?: FromTo
}

const props = withDefaults(defineProps<MagicScrollSceneProps>(), {
  from: 'top-bottom',
  to: 'bottom-top',
})

const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollParent = inject(MagicScrollParent)

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

watch(
  () => scrollReturn?.y.value,
  () => {
    if (intersecting.value) {
      calculate()
    }
  }
)

watch(
  () => scrollReturn?.y.value,
  () => {
    calculate()
  },
  { once: true }
)

useIntersectionObserver(
  elRef,
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
    if (isIntersecting) {
      calculate()
    }
  },
  { rootMargin: '150% 0px 150% 0px', immediate: true }
)

provide(MagicScrollProgress, readonly(progress))
</script>
