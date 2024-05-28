<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :id="mappedId"
    :class="{ '-active': item.active, '-disabled': disabled }"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @mouseleave="guardedUnselect"
  >
    <slot :is-active="item.active" :is-disabled="disabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, onBeforeUnmount, watch } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
  MagicMenuItemId,
  MagicMenuItemActive,
} from '../symbols'

interface MagicMenuItemProps {
  id?: string
  disabled?: boolean
}

const props = defineProps<MagicMenuItemProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const contentId = inject(MagicMenuContentId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuView')
}

if (!contentId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuContent')
}

const mappedId = computed(() => props.id ?? `magic-menu-item-${uuid()}`)

// Register item
const { initializeItem, deleteItem, selectItem, unselectItem } = useMenuItem({
  instanceId,
  viewId,
})

// Guarded select
// Check for mode as well as active state
const { initializeState } = useMenuState(instanceId)
const state = initializeState()
const item = initializeItem({
  id: mappedId.value,
  disabled: props.disabled ?? false,
})

function guardedSelect() {
  if (
    state.input.type === 'pointer' &&
    !state.input.disabled.includes('pointer') &&
    !item.active &&
    !item.disabled
  ) {
    selectItem(mappedId.value)
  }
}

// Guarded unselect
// Check for active nested views
const { getNestedView, unselectAllViews } = useMenuView(instanceId)
const nestedView = computed(() => getNestedView(mappedId.value))

function guardedUnselect() {
  // If there is no nested active view, unselect the item
  if (!nestedView.value || !nestedView.value.active) {
    unselectItem(mappedId.value)
  } else {
    // If there is a nested active view,
    // unselect the item once it is closed
    watch(
      () => nestedView.value?.active,
      (value) => {
        if (!value) {
          unselectItem(mappedId.value)
        }
      },
      { once: true }
    )
  }
}

// Pass id and active state to children
provide(MagicMenuItemId, mappedId.value)
provide(MagicMenuItemActive, item.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})
</script>

<style>
.magic-menu-item {
  cursor: var(--magic-menu-item-cursor, default);
}

.magic-menu-item.-disabled {
  cursor: var(--magic-menu-item-cursor-disabled, not-allowed);
  & > * {
    pointer-events: none;
  }
}
</style>
