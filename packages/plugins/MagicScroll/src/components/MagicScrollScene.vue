<template>
  <div ref="el" class="magic-scroll-scene">
    <slot :progress="progress" />
  </div>
</template>

<script lang="ts" setup>
import {
  shallowRef,
  provide,
  inject,
  watch,
  nextTick,
  readonly,
  useTemplateRef,
  onScopeDispose,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useScrollApi } from '../composables/private/useScrollApi'
import {
  MagicScrollTarget,
  MagicScrollProgress,
  MagicScrollReturn,
} from '../symbols'

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

onScopeDispose(() => {
  intersectionObserver.stop()
})

provide(MagicScrollProgress, readonly(progress))
</script>
