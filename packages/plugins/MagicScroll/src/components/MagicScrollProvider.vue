<template>
  <div class="magic-scroll-provider">
    <slot :scroll-return="scrollReturn" />
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import {
  useScroll,
  unrefElement,
  type MaybeComputedElementRef,
} from '@vueuse/core'
import { MagicScrollReturn, MagicScrollParent } from '../symbols'

interface MagicScrollProviderProps {
  active?: Boolean
  el?: MaybeComputedElementRef<HTMLElement>
}
const props = withDefaults(defineProps<MagicScrollProviderProps>(), {
  active: () => true,
})

// computed is used to avoid reactivity issues
const mappedEl = computed(() => {
  if (props.el) return unrefElement(props.el)
  if (typeof window === 'undefined') return undefined
  return window
})

const mappedParent = computed(() => {
  if (props.el) return unrefElement(props.el)
  return undefined
})

const scrollReturn = useScroll(mappedEl)

provide(MagicScrollReturn, scrollReturn)
provide(MagicScrollParent, mappedParent)
</script>
