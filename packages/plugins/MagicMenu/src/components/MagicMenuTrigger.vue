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
import { useMenuItem } from '../composables/private/useMenuItem'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

import type { MagicMenuTrigger } from '../types'

interface MagicMenuTriggerProps {
  disabled?: boolean
  trigger?: MagicMenuTrigger
}

const props = defineProps<MagicMenuTriggerProps>()

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
const mappedTrigger = computed(() => {
  if (props.trigger) {
    return props.trigger
  }

  switch (state.options.mode) {
    case 'menubar':
      return view?.parent.item
        ? ['mouseenter', 'mouseleave', 'click']
        : ['mouseenter', 'click']
    case 'dropdown':
      return view?.parent.item
        ? ['mouseenter', 'mouseleave', 'click']
        : ['click']
    case 'context':
      return ['right-click']
  }
})

function onMouseenter() {
  if (
    mappedTrigger.value.includes('mouseenter') &&
    view &&
    viewId &&
    state.active &&
    !mappedDisabled.value
  ) {
    selectView(viewId)

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.inputView = viewId
    }
  }
}

function onClick() {
  if (
    mappedTrigger.value.includes('click') &&
    view &&
    viewId &&
    !mappedDisabled.value
  ) {
    selectView(viewId)
    state.active = true

    // If the trigger is nested inside an item, don’t focus the view
    if (!itemId) {
      state.inputView = viewId
    }
  }
}

function onMouseleave() {
  if (mappedTrigger.value.includes('mouseleave') && view && viewId) {
    unselectView(viewId)
  }
}
</script>
