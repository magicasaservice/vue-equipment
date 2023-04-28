<template>
  <div ref="el" class="magic-scroll-scene">
    <slot :map-value="mapValue" :progress="progress" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  provide,
  inject,
  computed,
  onMounted,
  watch,
  nextTick,
  toRaw,
} from 'vue'
import { useUtils } from '../composables/useUtils'
import { useProgress } from '../composables/useProgress'
import { useIntersectionObserver } from '@vueuse/core'
import { WindowScrollKey, ScrollProgressKey, FromTo } from '../types'

interface Props {
  from?: FromTo
  to?: FromTo
  debug?: boolean
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { from = 'top-bottom', to = 'bottom-top' } = defineProps<Props>()

const scrollPosition = inject(WindowScrollKey, { x: 0, y: 0 })
const pageYOffset = computed(() => scrollPosition.y)

const el = ref()
const progress = ref(0)

const { getCalculations, getProgress } = useProgress(toRaw(el), from, to)

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
  toRaw(el),
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
  },
  { rootMargin: '150% 0px 150% 0px' }
)

const { mapValue } = useUtils()

provide('mapValue', mapValue)
provide(
  ScrollProgressKey,
  computed(() => progress.value)
)
</script>
