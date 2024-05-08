<template>
  <div ref="targetRef" :style="{ display: 'contents' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue'
import { toValue } from '@vueuse/core'
import { useCollisionDetect } from '../composables/useCollisionDetect'
import { MagicScrollReturn } from '../symbols'

import type { CollisionEntry } from '../types'

interface Props {
  collisionEntries: CollisionEntry[]
}

const props = defineProps<Props>()
const targetRef = ref<HTMLElement | undefined>(undefined)

const scrollReturn = inject(MagicScrollReturn, undefined)
const pageYOffset = computed(() => toValue(scrollReturn?.y) || 0)

onMounted(() => {
  useCollisionDetect(pageYOffset, props.collisionEntries, toValue(targetRef))
})
</script>
