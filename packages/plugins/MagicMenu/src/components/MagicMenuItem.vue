<template>
  <div
    :id="mappedId"
    ref="elRef"
    class="magic-menu-item"
    :data-disabled="disabled"
    :data-active="item.active"
    :data-pointer-disabled="pointerDisabled"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @mouseleave="guardedUnselect"
    @click="onClick"
  >
    <slot :item-active="item.active" :item-disabled="disabled" />
    <div v-if="pointerDisabled" class="magic-menu-item__pointer-guard" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  inject,
  provide,
  onBeforeUnmount,
  watch,
  useId,
} from 'vue'
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

const { id, disabled } = defineProps<MagicMenuItemProps>()
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const contentId = inject(MagicMenuContentId, undefined)

const elRef = ref<HTMLElement | undefined>(undefined)

if (!instanceId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuView')
}

if (!contentId) {
  throw new Error('MagicMenuItem must be nested inside MagicMenuContent')
}
const mappedId = computed(() => id ?? `magic-menu-item-${useId()}`)
const mappedActive = computed(() => item.active)

// Register item
const { initializeItem, deleteItem, selectItem, unselectItem } = useMenuItem({
  instanceId,
  viewId,
})

// Guarded select
// Check for mode and active state
const { initializeState } = useMenuState(instanceId)
const state = initializeState()
const item = initializeItem({
  id: mappedId.value,
  disabled: disabled ?? false,
})

const pointerDisabled = computed(() => state.input.disabled.includes('pointer'))

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
    //  unselect the item once it is closed
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

function onClick(event: MouseEvent) {
  emit('click', event)

  state.input.type = 'pointer'
  state.input.disabled = []

  if (!item.disabled && !item.active) {
    selectItem(mappedId.value)
  }

  if (!nestedView.value) {
    state.active = false
    unselectAllViews()
  }
}

// Pass id and active state to children
provide(MagicMenuItemId, mappedId.value)
provide(MagicMenuItemActive, mappedActive)

// Lifecycle
onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})
</script>

<style>
.magic-menu-item {
  cursor: var(--magic-menu-item-cursor, default);
}

.magic-menu-item__pointer-guard {
  position: absolute;
  inset: 0;
}
</style>
