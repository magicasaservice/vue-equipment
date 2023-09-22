<template>
  <div class="magic-scroll-provider">
    <slot :scroll-position="scrollPosition" />
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import { ScrollPositionKey, ScrollParentKey } from '../symbols'

interface Props {
  active?: Boolean
  el?: HTMLElement
}
const props = withDefaults(defineProps<Props>(), {
  active: () => true,
})

// computed is used to avoid reactivity issues
const mappedEl = computed(() => {
  if (props.el) return props.el
  if (typeof window === 'undefined') return undefined
  return window
})

const mappedParent = computed(() => {
  if (props.el) return props.el
  return undefined
})

const scrollPosition = useScroll(mappedEl)

provide(ScrollPositionKey, scrollPosition)
provide(ScrollParentKey, mappedParent)
</script>
