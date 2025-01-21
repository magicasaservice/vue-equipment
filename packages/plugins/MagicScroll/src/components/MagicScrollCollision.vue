<template>
  <div ref="elRef" :style="{ display: 'contents' }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted } from 'vue'
import { toValue } from '@vueuse/core'
import { useCollisionDetect } from '../composables/private/useCollisionDetect'
import { MagicScrollReturn } from '../symbols'

import type { MagicScrollCollisionEntry } from '../types'

interface Props {
  entries: MagicScrollCollisionEntry[]
}

const props = defineProps<Props>()
const elRef = ref<HTMLElement | undefined>(undefined)

const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollY = computed(() => toValue(scrollReturn?.y) || 0)

onMounted(() => {
  useCollisionDetect({
    scrollY,
    entries: props.entries,
    parent: toValue(elRef),
  })
})
</script>
