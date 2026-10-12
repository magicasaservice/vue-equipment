<template>
  <MirrorPrimitive
    :as="as"
    :as-child="asChild"
    :class="menuBoxBase"
    :data-size="size"
  >
    <slot />
  </MirrorPrimitive>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { Primitive as MirrorPrimitive } from '@maas/mirror/vue'
import { menuBoxBase } from '../styles/menu-box'
import { MenuBoxSizeKey } from '../types/menu-box'

import type { MMenuBoxProps } from '../types/menu-box'

const {
  as = 'div',
  size = 'md',
  asChild = false,
} = defineProps<MMenuBoxProps>()

// Items and cards inside the box follow its size unless they set one of their
// own. v1 passed the same value down the same way.
provide(
  MenuBoxSizeKey,
  computed(() => size)
)
</script>

<style>
/*
 * The radius is the one value with no utility: v1 resolved it as the radius
 * ramp step for the size plus the box’s own padding, so the corner of an item
 * sitting flush against the padding stays concentric with the corner of the
 * box. Written once as a calc, with the ramp stepped per `data-size`.
 *
 * Unscoped and rooted at `.m-menu-box`, because the slot content carries the
 * calling component’s scope id rather than this one’s.
 *
 * Nothing here sets a property the class list sets, so stylesheet order does
 * not matter.
 */
.m-menu-box {
  --m-menu-box-padding: var(--spacing);
  --m-menu-box-radius: var(--app-dimension-radius-lg);
  --m-menu-box-blur: 8rem;

  border-radius: calc(var(--m-menu-box-radius) + var(--m-menu-box-padding));
  box-shadow: var(--m-menu-box-shadow, var(--app-box-shadow-high));
  backdrop-filter: blur(var(--m-menu-box-blur));
}

.m-menu-box[data-size='xs'] {
  --m-menu-box-radius: var(--app-dimension-radius-sm);
}

.m-menu-box[data-size='sm'] {
  --m-menu-box-radius: var(--app-dimension-radius-md);
}

.m-menu-box[data-size='md'] {
  --m-menu-box-radius: var(--app-dimension-radius-lg);
}

.m-menu-box[data-size='lg'] {
  --m-menu-box-radius: var(--app-dimension-radius-xl);
}
</style>
