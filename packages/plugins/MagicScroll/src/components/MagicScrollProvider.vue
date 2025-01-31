<template>
  <div class="magic-scroll-provider">
    <slot :scroll-return="scrollReturn" />
  </div>
</template>

<script lang="ts" setup>
import { provide, computed } from 'vue'
import {
  useScroll,
  unrefElement,
  type MaybeComputedElementRef,
} from '@vueuse/core'
import { MagicScrollReturn, MagicScrollParent } from '../symbols'

interface MagicScrollProviderProps {
  target?: MaybeComputedElementRef<HTMLElement>
}

const { target } = defineProps<MagicScrollProviderProps>()

const mappedTarget = computed(() => {
  switch (true) {
    case !!target:
      return unrefElement(target)
    case typeof window !== 'undefined':
      return window
    default:
      return undefined
  }
})

const mappedParent = computed(() => {
  if (target) return unrefElement(target)
  return undefined
})

const scrollReturn = useScroll(mappedTarget)

provide(MagicScrollReturn, scrollReturn)
provide(MagicScrollParent, mappedParent)
</script>
