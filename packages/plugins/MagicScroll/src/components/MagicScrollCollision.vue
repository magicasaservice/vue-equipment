<template>
  <div ref="el" :data-id="mappedId" class="magic-scroll-collision">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  shallowRef,
  inject,
  computed,
  toValue,
  watch,
  useId,
  onMounted,
  useTemplateRef,
} from 'vue'
import { useCollisionDetection } from '../composables/private/useCollisionDetection'
import { MagicScrollReturn, MagicScrollTarget } from '../symbols'

import type { CollisionOffset } from '../types'
import { useIntersectionObserver } from '@vueuse/core'

interface MagicScrollCollisionProps {
  id?: string
  offset?: CollisionOffset
}

const { id, offset } = defineProps<MagicScrollCollisionProps>()
const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollTarget = inject(MagicScrollTarget)

if (!scrollTarget) {
  console.error(
    'MagicScrollCollision must be used within a MagicScrollProvider'
  )
}

const intersecting = shallowRef(false)
const elRef = useTemplateRef('el')

const scrollY = computed(() => toValue(scrollReturn?.y) || 0)
const mappedId = computed(() => id ?? `magic-scroll-collision-${useId()}`)

const { observe } = useCollisionDetection({
  id: mappedId.value,
  child: elRef,
  parent: scrollTarget,
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
