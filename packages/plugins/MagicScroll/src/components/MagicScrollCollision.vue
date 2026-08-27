<template>
  <div ref="el" :data-id="mappedId" class="magic-scroll-collision">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  onMounted,
  shallowRef,
  toValue,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useCollisionDetection } from '../composables/private/useCollisionDetection'
import { MagicScrollReturn, MagicScrollTarget } from '../symbols'

import type { UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

import type { CollisionOffset } from '../types'

interface MagicScrollCollisionProps {
  id?: string
  offset?: CollisionOffset
}

const { id, offset } = defineProps<MagicScrollCollisionProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicScroll',
  source: 'MagicScrollCollision',
})

const scrollReturn = inject(MagicScrollReturn, undefined)
const scrollTarget = inject(MagicScrollTarget)

magicError.assert(scrollTarget, {
  message: 'MagicScrollCollision must be used within a MagicScrollProvider',
  errorCode: 'missing_scroll_target',
})

const intersecting = shallowRef(false)
const elRef = useTemplateRef('el')

const uuid = useId()
const mappedId = computed(() => id ?? `magic-scroll-collision-${uuid}`)
const scrollY = computed(() => toValue(scrollReturn?.y) || 0)

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
  ([entry]) => {
    intersecting.value = entry?.isIntersecting ?? intersecting.value
  },
  { rootMargin: '150% 0px 150% 0px', immediate: true }
)

onMounted(() => {
  observe()
})
</script>
