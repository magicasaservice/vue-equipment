<template>
  <div ref="targetRef" :style="{ display: 'contents' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue'
import { toValue } from '@vueuse/core'
import { useCollisionDetect } from '../composables/useCollisionDetect'
import { ScrollPositionKey } from '../symbols'

import type { CollisionEntry } from '../types'

interface Props {
  collisionEntries: CollisionEntry[]
}

const props = defineProps<Props>()
const targetRef = ref<HTMLElement | undefined>(undefined)

const scrollPosition = inject(ScrollPositionKey, undefined)
const pageYOffset = computed(() => toValue(scrollPosition?.y) || 0)

onMounted(() => {
  useCollisionDetect(pageYOffset, props.collisionEntries, toValue(targetRef))
})
</script>
