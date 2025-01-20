<template>
  <div
    :id="mappedId"
    ref="elRef"
    class="magic-command-item"
    :data-disabled="disabled"
    :data-active="item.active"
    :data-pointer-disabled="pointerDisabled"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @mouseleave="guardedUnselect"
    @click="onClick"
  >
    <slot :item-active="item.active" :is-disabled="disabled" />
    <div v-if="pointerDisabled" class="magic-command-item__pointer-guard" />
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
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandState } from '../composables/private/useCommandState'
import { useCommandView } from '../composables/private/useCommandView'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandContentId,
  MagicCommandItemId,
  MagicCommandItemActive,
} from '../symbols'

interface MagicCommandItemProps {
  id?: string
  disabled?: boolean
}

const { id, disabled } = defineProps<MagicCommandItemProps>()
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)
const contentId = inject(MagicCommandContentId, undefined)

const elRef = ref<HTMLElement | undefined>(undefined)

if (!instanceId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandProvider')
}

if (!viewId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandView')
}

if (!contentId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandContent')
}
const mappedId = computed(() => id ?? `magic-command-item-${useId()}`)

// Register item
const { initializeItem, deleteItem, selectItem, unselectItem } = useCommandItem(
  {
    instanceId,
    viewId,
  }
)

// Guarded select
// Check for mode and active state
const { initializeState } = useCommandState(instanceId)
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
const { getNestedView, unselectAllViews } = useCommandView(instanceId)
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
provide(MagicCommandItemId, mappedId.value)
provide(MagicCommandItemActive, item.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})
</script>

<style>
.magic-command-item {
  cursor: var(--magic-command-item-cursor, default);
}

.magic-command-item[data-disabled='true'] {
  cursor: var(--magic-command-item-cursor-disabled, not-allowed);
  & > * {
    pointer-events: none;
  }
}

.magic-command-item__pointer-guard {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
