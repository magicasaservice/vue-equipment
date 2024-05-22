<template>
  <div
    class="magic-menu-trigger"
    ref="elRef"
    :class="{ '-active': view?.active, '-disabled': mappedDisabled }"
    :id="`${viewId}-trigger`"
    @click="onClick"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot :is-active="view?.active" :is-disabled="mappedDisabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'
import { useMenuItem } from '../composables/private/useMenuItem'

interface MagicMenuTrigger {
  disabled?: boolean
}

const props = defineProps<MagicMenuTrigger>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView, selectView, unselectView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const { getItem } = useMenuItem({ instanceId, viewId })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled)

function onMouseenter() {
  if (view && viewId && state.active && !mappedDisabled.value) {
    selectView(viewId)

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.inputView = viewId
    }
  }
}

function onClick() {
  if (view && viewId && !mappedDisabled.value) {
    selectView(viewId)
    state.active = true

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.inputView = viewId
    }
  }
}

function onMouseleave() {
  if (view && viewId) {
    unselectView(viewId)
  }
}
</script>
