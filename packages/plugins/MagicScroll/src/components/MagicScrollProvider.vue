<template>
  <div class="magic-scroll-provider">
    <slot :scroll-return="scrollReturn" />
  </div>
</template>

<script lang="ts" setup>
import { provide, computed } from 'vue'
import { useScroll, unrefElement, type MaybeElementRef } from '@vueuse/core'
import { MagicScrollReturn, MagicScrollTarget } from '../symbols'

interface MagicScrollProviderProps {
  target?: MaybeElementRef<HTMLElement>
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

const providedTarget = computed(() => {
  if (target) {
    return unrefElement(target)
  }

  return undefined
})

const scrollReturn = useScroll(mappedTarget)

provide(MagicScrollReturn, scrollReturn)
provide(MagicScrollTarget, providedTarget)
</script>
