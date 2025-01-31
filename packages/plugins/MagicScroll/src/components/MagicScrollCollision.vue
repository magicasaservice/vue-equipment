<template>
  <div ref="elRef" class="magic-scroll-collision">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, toValue, watch, useId, onMounted } from 'vue'
import { useCollisionDetection } from '../composables/private/useCollisionDetection'
import { MagicScrollReturn, MagicScrollParent } from '../symbols'

import type { CollisionOffset } from '../types'
import { useIntersectionObserver } from '@vueuse/core'

interface MagicScrollCollisionProps {
  id?: string
  offset?: CollisionOffset
}

const { id, offset } = defineProps<MagicScrollCollisionProps>()
const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollParent = inject(MagicScrollParent)

if (!scrollParent) {
  console.error(
    'MagicScrollCollision must be used inside a MagicScrollProvider'
  )
}

const intersecting = ref(false)
const elRef = ref<HTMLElement | undefined>(undefined)

const scrollY = computed(() => toValue(scrollReturn?.y) || 0)
const mappedId = computed(() => id ?? `magic-scroll-collision-${useId()}`)

const { observe } = useCollisionDetection({
  id: mappedId.value,
  child: elRef,
  parent: scrollParent,
  scrollY,
  offset,
})

watch(
  () => scrollY.value,
  () => {
    if (intersecting.value) {
      observe()
    }
  }
)

useIntersectionObserver(
  elRef,
  ([{ isIntersecting }]) => {
    intersecting.value = isIntersecting
  },
  { rootMargin: '150% 0px 150% 0px', immediate: true }
)

onMounted(() => {
  observe()
})
</script>
