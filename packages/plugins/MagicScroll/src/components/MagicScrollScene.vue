<template>
  <div ref="el" class="magic-scroll-scene" :data-progress="progress">
    <slot :progress="progress" />
  </div>
</template>

<script lang="ts" setup>
import {
  inject,
  nextTick,
  onBeforeUnmount,
  provide,
  readonly,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useScrollApi } from '../composables/private/useScrollApi'
import {
  MagicScrollProgress,
  MagicScrollReturn,
  MagicScrollTarget,
} from '../symbols'

import type { UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

import type { ScrollIntersection } from '../types'

interface MagicScrollSceneProps {
  from?: ScrollIntersection
  to?: ScrollIntersection
}

const { from = 'top-bottom', to = 'bottom-top' } =
  defineProps<MagicScrollSceneProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicScroll',
  source: 'MagicScrollScene',
})

const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollTarget = inject(MagicScrollTarget, undefined)

magicError.assert(scrollTarget, {
  message: 'MagicScrollScene must be used within a MagicScrollProvider',
  errorCode: 'missing_scroll_target',
})

const progress = shallowRef(0)
const intersecting = shallowRef(false)

const elRef = useTemplateRef('el')

const { getCalculations, getProgress } = useScrollApi({
  child: elRef,
  parent: scrollTarget,
  from,
  to,
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

const intersectionObserver = useIntersectionObserver(
  elRef,
  ([entry]) => {
    intersecting.value = entry?.isIntersecting ?? intersecting.value
    if (entry?.isIntersecting) {
      calculate()
    }
  },
  { rootMargin: '150% 0px 150% 0px', immediate: true }
)

onBeforeUnmount(() => {
  intersectionObserver.stop()
})

provide(MagicScrollProgress, readonly(progress))
</script>
