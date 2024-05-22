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
import { computed, inject, provide, onBeforeUnmount, onMounted } from 'vue'
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
  if (state.input === 'mouse' && !item.active && !item.disabled) {
    selectItem(mappedId.value)
  }
}

// Guarded unselect
// Check for active nested views
const { getNestedView } = useMenuView(instanceId)
const view = getNestedView(mappedId.value)

function guardedUnselect() {
  if (!view) {
    unselectItem(mappedId.value)
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
.magic-menu-item.-disabled {
  cursor: var(--magic-menu-cursor-disabled, not-allowed);
  & > * {
    pointer-events: none;
  }
}
</style>
