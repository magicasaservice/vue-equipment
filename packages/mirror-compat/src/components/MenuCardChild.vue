<template>
  <div
    :class="classes"
    :data-end="end || undefined"
    :data-label="!!slots.end || undefined"
    :data-size="mappedSize"
    :data-spread="spread || undefined"
    :data-start="start || undefined"
  >
    <div class="m-menu-card-child__content">
      <slot />
    </div>
    <span v-if="slots.end" class="m-menu-card-child__end">
      <slot name="end" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, toValue, useSlots } from 'vue'
import { menuCardChildBase, menuCardChildSize } from '../styles/menu-card'
import { MenuCardSizeKey } from '../types/menu-card'

import type { MMenuCardChildProps } from '../types/menu-card'

const {
  start = false,
  end = false,
  spread = false,
  size,
} = defineProps<MMenuCardChildProps>()

const slots = useSlots()

// A child with no size of its own follows the card it sits in, and falls back
// to v1’s default when there is no card.
const cardSize = inject(MenuCardSizeKey, undefined)

const mappedSize = computed(() => size ?? toValue(cardSize) ?? 'md')

const classes = computed(() => [
  menuCardChildBase,
  menuCardChildSize[mappedSize.value],
])
</script>

<style>
/*
 * The child half of v1’s `menu-card.css`. Its colours are not here: every one
 * of them depends on the card’s hover, selected and disabled state, so they
 * sit in `MenuCard.vue` where the card is the root of the selector. The size
 * variables are declared here because the card reads two of them back out
 * across the label wrapper, where the child’s size decides the spacing.
 *
 * Unscoped and rooted at `.m-menu-card-child`, because slot content carries
 * the calling component’s scope id rather than this one’s.
 */
.m-menu-card-child {
  --m-menu-card-child-gap: calc(var(--spacing) * 4.5);
  --m-menu-card-child-gap-label: calc(var(--spacing) * 0.75);
  --m-menu-card-child-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-card-child-symbol: calc(var(--spacing) * 4);

  line-height: var(--app-line-height);
}

.m-menu-card-child[data-size='xs'] {
  --m-menu-card-child-gap: calc(var(--spacing) * 3.5);
  --m-menu-card-child-gap-label: calc(var(--spacing) * 0.25);
  --m-menu-card-child-padding-label: calc(var(--spacing) * 0.5);
  --m-menu-card-child-symbol: calc(var(--spacing) * 3);
}

.m-menu-card-child[data-size='sm'] {
  --m-menu-card-child-gap: calc(var(--spacing) * 4);
  --m-menu-card-child-gap-label: calc(var(--spacing) * 0.5);
  --m-menu-card-child-padding-label: var(--spacing);
  --m-menu-card-child-symbol: calc(var(--spacing) * 3.5);
}

.m-menu-card-child[data-size='md'] {
  --m-menu-card-child-gap: calc(var(--spacing) * 4.5);
  --m-menu-card-child-gap-label: calc(var(--spacing) * 0.75);
  --m-menu-card-child-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-card-child-symbol: calc(var(--spacing) * 4);
}

.m-menu-card-child[data-size='lg'] {
  --m-menu-card-child-gap: calc(var(--spacing) * 5);
  --m-menu-card-child-gap-label: var(--spacing);
  --m-menu-card-child-padding-label: calc(var(--spacing) * 2);
  --m-menu-card-child-symbol: calc(var(--spacing) * 4.5);
}

.m-menu-card-child .m-menu-card-child__content {
  display: inline-flex;
  align-items: center;
  gap: var(--m-menu-card-child-gap);
  transition: all 100ms linear;
}

.m-menu-card-child .m-menu-card-child__content > span {
  transition: all 100ms linear;
}

/* An `end` slot puts a second box beside the label and squeezes the label. */
.m-menu-card-child[data-label='true'] {
  gap: var(--m-menu-card-child-gap);
  padding-right: var(--m-menu-card-child-padding-label);
}

.m-menu-card-child[data-label='true']
  .m-menu-card-child__content
  > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-menu-card-child[data-spread='true'] {
  width: 100%;
}

.m-menu-card-child[data-spread='true'] .m-menu-card-child__content {
  width: 100%;
  justify-content: space-between;
}

.m-menu-card-child[data-start='true']:not([data-label='true']) {
  padding-left: var(--m-menu-card-child-gap);
}

.m-menu-card-child[data-end='true']:not([data-label='true']) {
  padding-right: var(--m-menu-card-child-gap);
}

.m-menu-card-child .m-menu-card-child__content > svg {
  inline-size: var(--m-menu-card-child-symbol);
  block-size: var(--m-menu-card-child-symbol);
}
</style>
