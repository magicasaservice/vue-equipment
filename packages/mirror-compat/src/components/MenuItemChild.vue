<template>
  <div
    :class="menuItemChildBase"
    :data-end="end || undefined"
    :data-label="!!slots.end || undefined"
    :data-size="mappedSize"
    :data-spread="spread || undefined"
    :data-start="start || undefined"
    :data-truncate="truncate || undefined"
  >
    <div v-if="!slots.end" class="m-menu-item-child__content">
      <slot />
    </div>
    <div v-else class="m-menu-item-child__content">
      <span>
        <slot />
      </span>
      <span>
        <slot name="end" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, toValue, useSlots } from 'vue'
import { menuItemChildBase } from '../styles/menu-item'
import { MenuItemSizeKey } from '../types/menu-item'

import type { MMenuItemChildProps } from '../types/menu-item'

const {
  start = false,
  end = false,
  spread = false,
  truncate = false,
  size,
} = defineProps<MMenuItemChildProps>()

const slots = useSlots()

// A child with no size of its own follows the item it sits in, and falls back
// to v1’s default when there is no item.
const itemSize = inject(MenuItemSizeKey, undefined)

const mappedSize = computed(() => size ?? toValue(itemSize) ?? 'md')
</script>

<style>
/*
 * The child half of v1’s `menu-item.css`. Its command colour is not here: it
 * depends on the item’s hover, selected and disabled state, so it sits in
 * `MenuItem.vue` where the item is the root of the selector.
 *
 * Unscoped and rooted at `.m-menu-item-child`, because slot content carries
 * the calling component’s scope id rather than this one’s.
 */
.m-menu-item-child {
  --m-menu-item-child-gap: calc(var(--spacing) * 4);
  --m-menu-item-child-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-item-child-symbol: calc(var(--spacing) * 4.5);

  line-height: var(--app-line-height);
}

.m-menu-item-child[data-size='xs'] {
  --m-menu-item-child-gap: calc(var(--spacing) * 2);
  --m-menu-item-child-padding-label: calc(var(--spacing) * 0.5);
  --m-menu-item-child-symbol: calc(var(--spacing) * 3.5);
}

.m-menu-item-child[data-size='sm'] {
  --m-menu-item-child-gap: calc(var(--spacing) * 3.75);
  --m-menu-item-child-padding-label: var(--spacing);
  --m-menu-item-child-symbol: calc(var(--spacing) * 4);
}

.m-menu-item-child[data-size='md'] {
  --m-menu-item-child-gap: calc(var(--spacing) * 4);
  --m-menu-item-child-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-item-child-symbol: calc(var(--spacing) * 4.5);
}

.m-menu-item-child[data-size='lg'] {
  --m-menu-item-child-gap: calc(var(--spacing) * 4.25);
  --m-menu-item-child-padding-label: calc(var(--spacing) * 2);
  --m-menu-item-child-symbol: calc(var(--spacing) * 5);
}

.m-menu-item-child .m-menu-item-child__content {
  display: inline-flex;
  align-items: center;
  gap: var(--m-menu-item-child-gap);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*
 * The two wrappers the `end` slot adds are pass-through, so a caller’s own
 * flex or grid content lands in the same box it would without them.
 */
.m-menu-item-child .m-menu-item-child__content > span {
  display: contents;
}

/*
 * With a second slot to make room for, or with `truncate` asked for outright,
 * the label becomes the part that gives way.
 *
 * `.-truncate` is v1’s modifier class. It is matched here as well as the data
 * attribute because app templates pass it straight through `class`.
 */
.m-menu-item-child[data-label='true']
  .m-menu-item-child__content
  > span:first-child,
.m-menu-item-child[data-truncate='true']
  .m-menu-item-child__content
  > span:first-child,
.m-menu-item-child.-truncate .m-menu-item-child__content > span:first-child {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-menu-item-child[data-spread='true'] {
  width: 100%;
}

.m-menu-item-child[data-spread='true'] .m-menu-item-child__content {
  width: 100%;
  justify-content: space-between;
}

.m-menu-item-child[data-start='true']:not([data-label='true']) {
  padding-left: var(--m-menu-item-child-gap);
}

.m-menu-item-child[data-end='true']:not([data-label='true']) {
  padding-right: var(--m-menu-item-child-gap);
}

.m-menu-item-child[data-label='true'] {
  padding-right: var(--m-menu-item-child-padding-label);
}

.m-menu-item-child .m-menu-item-child__content > svg {
  inline-size: var(--m-menu-item-child-symbol);
  block-size: var(--m-menu-item-child-symbol);
}
</style>
