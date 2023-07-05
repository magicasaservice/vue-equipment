<template>
  <div ref="targetRef" :style="{ display: 'contents' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue'
import { toValue } from '@vueuse/shared'
import { useCollisionDetect } from '../composables/useCollisionDetect'
import { WindowDimensionsKey, WindowScrollKey } from '../types'

import type { CollisionEntry } from '../types'

interface Props {
  collisionEntries: CollisionEntry[]
}

const props = defineProps<Props>()
const targetRef = ref<HTMLElement | undefined>(undefined)
const colDetect = ref()

const scrollPosition = inject(WindowScrollKey, { x: 0, y: 0 })
const windowDimensions = inject(WindowDimensionsKey, { vh: 0, vw: 0 })
const pageYOffset = computed(() => scrollPosition.y)

onMounted(() => {
  colDetect.value = useCollisionDetect(
    pageYOffset,
    windowDimensions,
    props.collisionEntries,
    toValue(targetRef.value)
  )
})
</script>
