<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :id="mappedId"
    :class="{ '-active': item.active }"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @mouseleave="guardedUnselect"
  >
    <slot :is-active="item.active" />
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
  MagicMenuItemId,
  MagicMenuItemActive,
} from '../symbols'

interface MagicMenuItemProps {
  id?: string
}

const props = defineProps<MagicMenuItemProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuItem must be used inside a MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuItem must be used inside a MagicMenuView')
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
const item = initializeItem(mappedId.value)

function guardedSelect() {
  if (state.mode === 'mouse' && !item.active) {
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
