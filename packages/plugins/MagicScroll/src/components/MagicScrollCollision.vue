<template>
  <div ref="el" :style="{ display: 'contents' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, toRaw } from 'vue'
import { useCollisionDetect } from '../composables/useCollisionDetect'
import { WindowDimensionsKey, WindowScrollKey, CollisionEntry } from '../types'

interface Props {
  collisionEntries: CollisionEntry[]
}

const props = defineProps<Props>()
const el = ref()
const colDetect = ref()

const scrollPosition = inject(WindowScrollKey, { x: 0, y: 0 })
const windowDimensions = inject(WindowDimensionsKey, { vh: ref(0), vw: ref(0) })
const pageYOffset = computed(() => scrollPosition.y)

onMounted(() => {
  colDetect.value = useCollisionDetect(
    pageYOffset,
    windowDimensions,
    props.collisionEntries,
    toRaw(el.value)
  )
})
</script>
