<template>
  <avatar-root
    as="div"
    :class="[
      'm-avatar',
      `-${mode}`,
      `-${size}`,
      { '-inline': inline, '-image': image, '-round': round },
    ]"
  >
    <slot>
      <avatar-fallback as="span">{{ initials }}</avatar-fallback>
    </slot>
  </avatar-root>
</template>

<script lang="ts" setup>
import { AvatarFallback, AvatarRoot } from '@maas/mirror/vue'

// `IAvatarProps`, verbatim, plus `variant`
interface MAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  mode?: 'solid' | 'translucent' | 'outline'
  initials?: string
  inline?: boolean
  image?: boolean
  round?: boolean
  /**
   * Never a prop in v1: it fell through `$attrs` onto the root `<div>` and
   * styled nothing. Declared here so it stops landing in the DOM.
   */
  variant?: string
}

const {
  size = 'md',
  mode = 'solid',
  initials = '',
  inline = false,
  image = false,
  round = false,
} = defineProps<MAvatarProps>()
</script>
