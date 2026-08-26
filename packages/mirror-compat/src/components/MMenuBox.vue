<template>
  <primitive :as="as" :as-child="asChild" :class="['m-menu-box', `-${size}`]">
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, provide, type Component } from 'vue'
import { Primitive } from '@maas/mirror/vue'

// Presentational, no Mirror import. The size travels to `m-menu-item` and
// `m-menu-card` on a string key so the wrapper set needs no shared module.
interface MMenuBoxProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  // v1 typed this as `Extract<ElementOrComponent, 'ol' | 'ul' | 'div' |
  // 'dialog'>`, and `ElementOrComponent` has no `dialog`, so `dialog` was
  // never assignable there either
  as?: 'ol' | 'ul' | 'div' | Component
  asChild?: boolean
}

const {
  size = 'md',
  as = 'div',
  asChild = false,
} = defineProps<MMenuBoxProps>()

const mappedSize = computed(() => size)

provide('m-menu-box-size', mappedSize)
</script>
