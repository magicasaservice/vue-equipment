<template>
  <div
    :class="classes"
    :data-disabled="disabled || undefined"
    :data-mode="mode"
    :data-selected="selected || undefined"
    :data-size="mappedSize"
    :data-slot-end="!!slots.end || undefined"
    :data-slot-start="!!slots.start || undefined"
  >
    <div v-if="slots.start" class="m-menu-item__start">
      <slot name="start" />
    </div>
    <div class="m-menu-item__label">
      <slot />
    </div>
    <div v-if="slots.end" class="m-menu-item__end">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  toValue,
  useSlots,
} from 'vue'
import {
  menuItemBase,
  menuItemColor,
  menuItemCursor,
  menuItemDisabledColor,
  menuItemDisabledCursor,
  menuItemDisabledSelectedColor,
  menuItemSelectedColor,
  menuItemSize,
} from '../styles/menu-item'
import { MenuBoxSizeKey } from '../types/menu-box'
import { MenuItemSizeKey } from '../types/menu-item'

import type { MMenuItemProps } from '../types/menu-item'

const {
  mode = 'ghost',
  size,
  selected = false,
  disabled = false,
} = defineProps<MMenuItemProps>()

const emit = defineEmits<{
  (e: 'enter'): void
}>()

const slots = useSlots()

// An item with no size of its own follows the box it sits in, and falls back
// to v1’s default when there is no box.
const boxSize = inject(MenuBoxSizeKey, undefined)

const mappedSize = computed(() => size ?? toValue(boxSize) ?? 'md')

provide(MenuItemSizeKey, mappedSize)

// Exactly one class per CSS property reaches the element. Two utilities for
// the same property would be resolved by the order Tailwind emits them in
// rather than by the order they sit in this list, so the branches pick.
const classes = computed(() => {
  const out = [menuItemBase, menuItemSize[mappedSize.value]]

  out.push(disabled ? menuItemDisabledCursor : menuItemCursor)

  if (disabled) {
    out.push(
      selected
        ? menuItemDisabledSelectedColor[mode]
        : menuItemDisabledColor[mode]
    )
  } else {
    out.push(selected ? menuItemSelectedColor[mode] : menuItemColor[mode])
  }

  return out
})

// v1 listened on the window rather than the item, so a selected item answers
// Return from wherever focus happens to be. Reproduced without the composable
// v1 reached for, to keep the package’s dependencies where they are.
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return
  }

  if (!disabled && selected) {
    emit('enter')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style>
/*
 * The port of v1’s `menu-item.css`. Component tokens become the application
 * variables they resolved to, modifier classes become the data attributes the
 * item writes, and the structural selectors carry over unchanged.
 *
 * Unscoped, and every selector rooted at `.m-menu-item`, because slot content
 * carries the calling component’s scope id rather than this one’s. That is
 * also why the command colours of `.m-menu-item-child` live here: they depend
 * on the item’s hover, selected and disabled state, and no utility can look up
 * the tree.
 *
 * Nothing here sets a property the class list sets, so stylesheet order does
 * not matter.
 */
.m-menu-item {
  --m-menu-item-gap: calc(var(--spacing) * 4);
  --m-menu-item-padding-label: calc(var(--spacing) * 1.5);
}

.m-menu-item[data-size='xs'] {
  --m-menu-item-gap: calc(var(--spacing) * 2);
  --m-menu-item-padding-label: calc(var(--spacing) * 0.5);
}

.m-menu-item[data-size='sm'] {
  --m-menu-item-gap: calc(var(--spacing) * 3.75);
  --m-menu-item-padding-label: var(--spacing);
}

.m-menu-item[data-size='md'] {
  --m-menu-item-gap: calc(var(--spacing) * 4);
  --m-menu-item-padding-label: calc(var(--spacing) * 1.5);
}

.m-menu-item[data-size='lg'] {
  --m-menu-item-gap: calc(var(--spacing) * 4.25);
  --m-menu-item-padding-label: calc(var(--spacing) * 2);
}

.m-menu-item .m-menu-item__start {
  display: flex;
  align-items: center;
}

.m-menu-item .m-menu-item__label {
  display: inline-flex;
  height: 100%;
  flex: 1;
  align-items: center;
  overflow: hidden;
  font-size: var(--m-menu-item-label-font-size, 1em);
}

/*
 * With nothing in the start slot the label carries the inset the start slot
 * would have taken, so a menu of items with and without icons keeps one
 * optical left edge.
 */
.m-menu-item:not([data-slot-start='true']) .m-menu-item__label {
  padding-left: calc(var(--m-menu-item-gap) + var(--m-menu-item-padding-label));
}

/*
 * The command wrapper. Family, weight and size are the item’s, so inheritance
 * delivers them; only the tighter line height and the numerals differ.
 */
.m-menu-item .m-menu-item__end {
  display: flex;
  align-items: center;
  font-variant-numeric: lining-nums tabular-nums;
  line-height: var(--app-line-height-none);
}

/*
 * Command colour. Both modes resolved to the same pair of tokens in v1, so
 * only the item’s state selects between them.
 */
.m-menu-item:not([data-disabled='true']) .m-menu-item-child[data-end='true'] {
  color: var(--app-color-primary-fg-muted);
  transition: all 100ms linear;
}

.m-menu-item:not([data-disabled='true']):hover
  .m-menu-item-child[data-end='true'],
.m-menu-item:not([data-disabled='true'])[data-selected='true']
  .m-menu-item-child[data-end='true'] {
  color: var(--m-menu-item-end-color-hover, var(--app-color-primary-fg-solid));
}

.m-menu-item[data-disabled='true'] .m-menu-item-child[data-end='true'] {
  color: var(--app-color-disabled-fg-muted);
  transition: all 100ms linear;
}

.m-menu-item[data-disabled='true'][data-selected='true']
  .m-menu-item-child[data-end='true'] {
  color: var(--app-color-disabled-fg-solid);
}
</style>
