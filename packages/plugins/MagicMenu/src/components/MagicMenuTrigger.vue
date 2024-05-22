<template>
  <div
    class="magic-menu-trigger"
    ref="elRef"
    :class="{ '-active': view?.active }"
    :id="`${viewId}-trigger`"
    @click="onClick"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot :is-active="view?.active" />
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be used inside a MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be used inside a MagicMenuView')
}

const { getView, selectView, unselectView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

function onMouseenter() {
  if (view && viewId && state.active) {
    selectView(viewId)

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.viewInFocus = viewId
    }
  }
}

function onClick() {
  if (view && viewId) {
    selectView(viewId)
    state.active = true

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.viewInFocus = viewId
    }
  }
}

function onMouseleave() {
  if (view && viewId) {
    unselectView(viewId)
  }
}
</script>
